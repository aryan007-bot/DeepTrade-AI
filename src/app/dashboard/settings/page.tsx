"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Shield,
  Bell,
  Wallet,
  Key,
  Save,
  AlertTriangle
} from "lucide-react";
import { SubscriptionManager } from "@/components/SubscriptionManager";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">
            Manage your account preferences and trading bot configurations.
          </p>
        </div>

        <Tabs defaultValue="subscription" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-gray-700">
            <TabsTrigger value="subscription" className="data-[state=active]:bg-[#00d2cee6]">
              Subscription
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#00d2cee6]">
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-[#00d2cee6]">
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-[#00d2cee6]">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="trading" className="data-[state=active]:bg-[#00d2cee6]">
              Trading
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-[#00d2cee6]">
              API Keys
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscription" className="mt-6">
            <SubscriptionManager />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <Card className="bg-[#051419] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User size={20} />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update your personal information and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="timezone" className="text-gray-300">Timezone</Label>
                  <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white">
                    <option>UTC-8 (Pacific Time)</option>
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC+8 (Singapore Time)</option>
                  </select>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-500">
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-[#051419] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield size={20} />
                    Security Settings
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your account security and authentication methods.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div>
                      <p className="font-medium text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-400">Add an extra layer of security</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-500 border-green-500">
                        Enabled
                      </Badge>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                        Configure
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div>
                      <p className="font-medium text-white">Session Management</p>
                      <p className="text-sm text-gray-400">Manage active sessions</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      View Sessions
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#051419] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="text-gray-300">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-gray-300">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-300">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-500">
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card className="bg-[#051419] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Bell size={20} />
                  Notification Preferences
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure how you want to receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: "Trade Executions", description: "Get notified when your bots execute trades", enabled: true },
                  { title: "Profit/Loss Alerts", description: "Receive alerts for significant P&L changes", enabled: true },
                  { title: "Bot Status Changes", description: "Notifications when bots start/stop", enabled: false },
                  { title: "Market Alerts", description: "Important market movement notifications", enabled: true },
                  { title: "Weekly Reports", description: "Weekly performance summary emails", enabled: true },
                  { title: "Security Alerts", description: "Login and security-related notifications", enabled: true }
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{setting.title}</p>
                      <p className="text-sm text-gray-400">{setting.description}</p>
                    </div>
                    <Switch defaultChecked={setting.enabled} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trading" className="mt-6">
            <Card className="bg-[#051419] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Wallet size={20} />
                  Trading Preferences
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure default trading settings and risk parameters.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="defaultSlippage" className="text-gray-300">Default Slippage (%)</Label>
                    <Input
                      id="defaultSlippage"
                      type="number"
                      placeholder="0.5"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPositionSize" className="text-gray-300">Max Position Size (%)</Label>
                    <Input
                      id="maxPositionSize"
                      type="number"
                      placeholder="25"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stopLoss" className="text-gray-300">Default Stop Loss (%)</Label>
                    <Input
                      id="stopLoss"
                      type="number"
                      placeholder="5"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="takeProfit" className="text-gray-300">Default Take Profit (%)</Label>
                    <Input
                      id="takeProfit"
                      type="number"
                      placeholder="10"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Auto-compound Profits</p>
                    <p className="text-sm text-gray-400">Automatically reinvest profits</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-500">
                  <Save size={16} className="mr-2" />
                  Save Trading Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="mt-6">
            <Card className="bg-[#051419] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Key size={20} />
                  API Keys Management
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage API keys for external integrations and trading platforms.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} className="text-yellow-500" />
                    <p className="font-medium text-yellow-500">Security Notice</p>
                  </div>
                  <p className="text-sm text-gray-300">
                    Keep your API keys secure and never share them. Only grant necessary permissions.
                  </p>
                </div>
                
                <div className="space-y-3">
                  {[
                    { name: "Binance API", status: "Active", permissions: "Read, Trade", created: "2024-01-15" },
                    { name: "Coinbase Pro API", status: "Inactive", permissions: "Read Only", created: "2024-01-10" }
                  ].map((api, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{api.name}</p>
                        <p className="text-sm text-gray-400">
                          {api.permissions} • Created {api.created}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={api.status === "Active" ? "text-green-500 border-green-500" : "text-gray-500 border-gray-500"}
                        >
                          {api.status}
                        </Badge>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="bg-blue-600 hover:bg-blue-500">
                  <Key size={16} className="mr-2" />
                  Add New API Key
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}