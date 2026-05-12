import { Injectable } from '@nestjs/common';
import { genkit, z, Document } from 'genkit';
import cohere, { command } from 'genkitx-cohere';
import { ConfigService } from '@nestjs/config';
import { embedMultilingualLight3 } from 'genkitx-cohere';
import { IADto } from './IA.dto';
import { EntityManager } from '@mikro-orm/postgresql';
import { toSql } from 'pgvector';
import { Tasks } from '../tasks/entity/tasks.entity';

@Injectable()
export class IAService {
  constructor(
    private configService: ConfigService,
    private readonly em: EntityManager,
  ) {}

  IA() {
    return genkit({
      plugins: [
        cohere({ apiKey: this.configService.getOrThrow('COHERE_API_KEY') }),
      ],
      model: command,
    });
  }

  async generateEmbedding(task: Tasks) {
    const ia = this.IA();
    const embedding = (
      await ia.embed({
        embedder: embedMultilingualLight3,
        content: `title: ${task.title}\ndescription: ${task.description ?? 'sem descrição'}`,
      })
    )[0].embedding;

    return embedding;
  }

  async defineFlowRetrivier() {
    const ia = this.IA();

    const QueryOptions = z.object({
      id: z.string(),
      limit: z.number().optional(),
    });

    return ia.defineRetriever(
      {
        name: 'pgvector-myTable',
        configSchema: QueryOptions,
      },
      async (input, options) => {
        const embedding = (
          await ia.embed({
            embedder: embedMultilingualLight3,
            content: input,
          })
        )[0].embedding;

        const results = await this.em.getConnection().execute(
          `SELECT id, title, description
             FROM tasks
             WHERE user_id = ?
             ORDER BY embedding <#> ?::vector
             LIMIT ?`,
        );

        return {
          documents: results.map((row: Record<string, unknown>) => {
            const { title, description, ...metadata } = row;
            return Document.fromText(
              `${title}\n${description ?? ''}`,
              metadata,
            );
          }),
        };
      },
    );
  }
}
