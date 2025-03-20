import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Pencil, Trash2 } from 'lucide-react';
import { PromptForm } from './prompt-form';

interface Prompt {
  id: string;
  name: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function PromptList() {
  const { data: prompts, error, mutate } = useSWR<Prompt[]>('/api/prompts');
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  const handleToggleActive = async (prompt: Prompt) => {
    try {
      await fetch(`/api/prompts/${prompt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !prompt.isActive }),
      });
      mutate();
    } catch (error) {
      console.error('Error toggling prompt:', error);
    }
  };

  const handleDelete = async (prompt: Prompt) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;

    try {
      await fetch(`/api/prompts/${prompt.id}`, {
        method: 'DELETE',
      });
      mutate();
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  };

  if (error) return <div>Failed to load prompts</div>;
  if (!prompts) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {editingPrompt && (
        <div className="rounded-lg border p-6">
          <PromptForm
            prompt={editingPrompt}
            onSuccess={() => {
              setEditingPrompt(null);
              mutate();
            }}
            onCancel={() => setEditingPrompt(null)}
          />
        </div>
      )}

      <div className="rounded-lg border">
        <div className="grid grid-cols-6 gap-4 p-4 font-medium">
          <div className="col-span-2">Name</div>
          <div className="col-span-2">Content</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        {prompts.map((prompt) => (
          <div
            key={prompt.id}
            className="grid grid-cols-6 gap-4 border-t p-4 items-center"
          >
            <div className="col-span-2">{prompt.name}</div>
            <div className="col-span-2 truncate">{prompt.content}</div>
            <div>
              <Switch
                checked={prompt.isActive}
                onCheckedChange={() => handleToggleActive(prompt)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingPrompt(prompt)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(prompt)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 