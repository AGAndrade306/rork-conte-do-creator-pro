import { protectedProcedure } from '../../../create-context';
import {
  generateIdeasInputSchema,
  generateContentIdeas,
} from '../../../../services/content/generate-ideas';

export const generateIdeasProcedure = protectedProcedure
  .input(generateIdeasInputSchema)
  .mutation(async ({ input }) => {
    try {
      const ideas = await generateContentIdeas(input);
      return { ideas };
    } catch (error) {
      console.error('[generateIdeas] Error:', error);
      throw new Error('Failed to generate ideas. Please try again.');
    }
  });

export default generateIdeasProcedure;
