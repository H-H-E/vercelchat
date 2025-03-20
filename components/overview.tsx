import { motion } from 'framer-motion';
import Link from 'next/link';

import { MessageIcon, VercelIcon } from './icons';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <h1 className="text-2xl font-bold">Welcome to Poiesis Pete!</h1>
        <p className="text-lg text-muted-foreground">
          Your friendly AI assistant for learning and exploration in Poiesis Education's afterschool programs.
        </p>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Example Prompts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted">
              <p className="font-medium mb-2">Learning Help</p>
              <p className="text-sm text-muted-foreground">"Can you help me understand fractions?"</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="font-medium mb-2">Creative Projects</p>
              <p className="text-sm text-muted-foreground">"Let's create a story about space exploration"</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="font-medium mb-2">Study Skills</p>
              <p className="text-sm text-muted-foreground">"How can I improve my note-taking?"</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="font-medium mb-2">Problem Solving</p>
              <p className="text-sm text-muted-foreground">"Can you help me solve this math problem?"</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Built with Next.js and the AI SDK by Vercel. Learn more about the{' '}
          <Link
            className="font-medium underline underline-offset-4"
            href="https://sdk.vercel.ai/docs"
            target="_blank"
          >
            AI SDK
          </Link>
          .
        </p>
      </div>
    </motion.div>
  );
};
