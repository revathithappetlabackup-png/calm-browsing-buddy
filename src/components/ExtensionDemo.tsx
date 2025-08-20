import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, X, Settings, Download, Eye, EyeOff } from 'lucide-react';

interface ExtensionStats {
  adsBlocked: number;
  popupsBlocked: number;
  redirectsBlocked: number;
}

interface ExtensionSettings {
  adBlocking: boolean;
  popupBlocking: boolean;
  redirectBlocking: boolean;
}

export function ExtensionDemo() {
  const [stats, setStats] = useState<ExtensionStats>({
    adsBlocked: 247,
    popupsBlocked: 12,
    redirectsBlocked: 5
  });
  
  const [settings, setSettings] = useState<ExtensionSettings>({
    adBlocking: true,
    popupBlocking: true,
    redirectBlocking: true
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [animateStats, setAnimateStats] = useState(false);

  // Simulate real-time blocking
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to block something
        setStats(prev => {
          const newStats = { ...prev };
          const blockType = Math.random();
          
          if (blockType > 0.6 && settings.adBlocking) {
            newStats.adsBlocked += Math.floor(Math.random() * 3) + 1;
          } else if (blockType > 0.3 && settings.popupBlocking) {
            newStats.popupsBlocked += 1;
          } else if (settings.redirectBlocking) {
            newStats.redirectsBlocked += 1;
          }
          
          return newStats;
        });
        
        setAnimateStats(true);
        setTimeout(() => setAnimateStats(false), 1000);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [settings]);

  const totalBlocked = stats.adsBlocked + stats.popupsBlocked + stats.redirectsBlocked;

  const handleSettingChange = (setting: keyof ExtensionSettings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-glow">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Calm Browsing Buddy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A production-ready browser extension that blocks ads, popups, and malicious redirects 
            for a cleaner, safer browsing experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Stats Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-soft border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Live Protection Status
                  </span>
                  <Badge variant="secondary" className="bg-success text-success-foreground">
                    Active
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className={`text-center p-4 rounded-xl bg-gradient-primary transition-all duration-500 ${animateStats ? 'scale-105 shadow-glow' : ''}`}>
                    <div className="text-3xl font-bold text-primary-foreground mb-1">
                      {stats.adsBlocked.toLocaleString()}
                    </div>
                    <div className="text-sm text-primary-foreground/80">Ads Blocked</div>
                  </div>
                  <div className={`text-center p-4 rounded-xl bg-gradient-success transition-all duration-500 ${animateStats ? 'scale-105 shadow-success' : ''}`}>
                    <div className="text-3xl font-bold text-success-foreground mb-1">
                      {stats.popupsBlocked}
                    </div>
                    <div className="text-sm text-success-foreground/80">Popups Prevented</div>
                  </div>
                  <div className={`text-center p-4 rounded-xl bg-warning text-warning-foreground transition-all duration-500 ${animateStats ? 'scale-105' : ''}`}>
                    <div className="text-3xl font-bold mb-1">
                      {stats.redirectsBlocked}
                    </div>
                    <div className="text-sm opacity-80">Redirects Stopped</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div>
                    <div className="font-semibold">Total Threats Blocked</div>
                    <div className="text-sm text-muted-foreground">Since installation</div>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {totalBlocked.toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls Card */}
          <Card className="shadow-soft border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Protection Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Ad Blocking</div>
                  <div className="text-sm text-muted-foreground">Block banner & video ads</div>
                </div>
                <Switch
                  checked={settings.adBlocking}
                  onCheckedChange={() => handleSettingChange('adBlocking')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Popup Blocking</div>
                  <div className="text-sm text-muted-foreground">Prevent unwanted popups</div>
                </div>
                <Switch
                  checked={settings.popupBlocking}
                  onCheckedChange={() => handleSettingChange('popupBlocking')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Redirect Blocking</div>
                  <div className="text-sm text-muted-foreground">Stop malicious redirects</div>
                </div>
                <Switch
                  checked={settings.redirectBlocking}
                  onCheckedChange={() => handleSettingChange('redirectBlocking')}
                />
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setShowSettings(!showSettings)}
              >
                {showSettings ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Hide Advanced Settings
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Show Advanced Settings
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Settings */}
        {showSettings && (
          <Card className="shadow-soft border-0 mb-8">
            <CardHeader>
              <CardTitle>Advanced Settings & Whitelist Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Whitelist Management</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">example.com</span>
                      <Button variant="outline" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">trusted-site.com</span>
                      <Button variant="outline" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Filter Lists</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium">EasyList</div>
                        <div className="text-xs text-muted-foreground">Last updated: 2 hours ago</div>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium">EasyPrivacy</div>
                        <div className="text-xs text-muted-foreground">Last updated: 1 day ago</div>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Extension Files */}
        <Card className="shadow-soft border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Extension Files
            </CardTitle>
            <p className="text-muted-foreground">
              Ready-to-use browser extension files with Manifest V3 support
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <div className="font-mono text-sm mb-2">manifest.json</div>
                <div className="text-xs text-muted-foreground mb-3">Extension manifest</div>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <div className="font-mono text-sm mb-2">background.js</div>
                <div className="text-xs text-muted-foreground mb-3">Service worker</div>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <div className="font-mono text-sm mb-2">content.js</div>
                <div className="text-xs text-muted-foreground mb-3">DOM manipulation</div>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <div className="font-mono text-sm mb-2">popup.html</div>
                <div className="text-xs text-muted-foreground mb-3">Extension UI</div>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Installation Instructions</h4>
              <ol className="text-sm space-y-1 text-muted-foreground">
                <li>1. Download all extension files</li>
                <li>2. Open Chrome/Edge and go to chrome://extensions/</li>
                <li>3. Enable "Developer mode"</li>
                <li>4. Click "Load unpacked" and select the extension folder</li>
                <li>5. The extension will be installed and ready to use!</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}