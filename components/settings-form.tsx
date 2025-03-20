import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Settings {
  openaiApiKey?: string;
  defaultChatModel: string;
  aiName: string;
  aiDescription: string;
  showArtifacts: boolean;
}

export function SettingsForm() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>({
    openaiApiKey: '',
    defaultChatModel: 'gpt-4o',
    aiName: 'Poiesis Pete',
    aiDescription: 'AI tutor for Poiesis Education',
    showArtifacts: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast({
          title: 'Settings updated',
          description: 'Your settings have been successfully updated.',
        });
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure the general app settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aiName">AI Assistant Name</Label>
                <Input
                  id="aiName"
                  value={settings.aiName}
                  onChange={(e) => setSettings({ ...settings, aiName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aiDescription">AI Description</Label>
                <Textarea
                  id="aiDescription"
                  value={settings.aiDescription}
                  onChange={(e) => setSettings({ ...settings, aiDescription: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showArtifacts"
                  checked={settings.showArtifacts}
                  onCheckedChange={(checked: boolean) => setSettings({ ...settings, showArtifacts: checked })}
                />
                <Label htmlFor="showArtifacts">Show Artifacts</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Settings</CardTitle>
              <CardDescription>
                Configure AI model settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultChatModel">Default Chat Model</Label>
                <Select 
                  value={settings.defaultChatModel}
                  onValueChange={(value) => setSettings({ ...settings, defaultChatModel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Configure API keys for external services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                <Input
                  id="openaiApiKey"
                  value={settings.openaiApiKey}
                  onChange={(e) => setSettings({ ...settings, openaiApiKey: e.target.value })}
                  type="password"
                  placeholder="sk-..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <CardFooter className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardFooter>
      </Tabs>
    </form>
  );
} 