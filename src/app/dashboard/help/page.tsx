"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Mail, 
  ExternalLink,
  Search,
  FileText,
  Video,
  Users
} from "lucide-react";

export default function HelpPage() {
  const faqItems = [
    {
      question: "How do I create my first trading bot?",
      answer: "Navigate to the 'Create Bot' tab and describe your trading strategy in natural language. Our AI will convert it into executable code.",
      category: "Getting Started"
    },
    {
      question: "What are the fees for using DeepTrade AI?",
      answer: "We charge a 2% performance fee on profitable trades. There are no monthly subscription fees or setup costs.",
      category: "Pricing"
    },
    {
      question: "How secure are my funds?",
      answer: "Your funds remain in your wallet. Our bots only have permission to execute trades, never to withdraw funds.",
      category: "Security"
    },
    {
      question: "Can I modify my bot's strategy after creation?",
      answer: "Yes, you can pause your bot, modify its strategy, and redeploy it at any time through the bot management interface.",
      category: "Bot Management"
    },
    {
      question: "What happens if my bot loses money?",
      answer: "All trading involves risk. We recommend setting stop-loss limits and only trading with funds you can afford to lose.",
      category: "Risk Management"
    }
  ];

  const tutorials = [
    {
      title: "Getting Started with DeepTrade AI",
      description: "Complete beginner's guide to setting up your first trading bot",
      type: "video",
      duration: "12 min",
      difficulty: "Beginner"
    },
    {
      title: "Advanced Strategy Creation",
      description: "Learn how to create complex trading strategies using natural language",
      type: "article",
      readTime: "8 min",
      difficulty: "Intermediate"
    },
    {
      title: "Risk Management Best Practices",
      description: "Essential tips for managing risk in automated trading",
      type: "video",
      duration: "15 min",
      difficulty: "Intermediate"
    },
    {
      title: "Cross-Chain Arbitrage Guide",
      description: "How to identify and execute profitable arbitrage opportunities",
      type: "article",
      readTime: "10 min",
      difficulty: "Advanced"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Help & Support</h1>
          <p className="text-gray-400">
            Find answers to common questions and get help with DeepTrade AI.
          </p>
        </div>

        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-700">
            <TabsTrigger value="faq" className="data-[state=active]:bg-blue-600">
              FAQ
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="data-[state=active]:bg-blue-600">
              Tutorials
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-blue-600">
              Contact
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-blue-600">
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-[#051419] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Search size={20} />
                    Search FAQ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Search for answers..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </CardContent>
              </Card>

              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <Card key={index} className="bg-[#051419] border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white text-lg">{item.question}</CardTitle>
                        <Badge variant="outline" className="text-blue-500 border-blue-500">
                          {item.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">{item.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tutorials" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-[#051419] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Book size={20} />
                    Learning Resources
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Step-by-step guides and video tutorials to help you master DeepTrade AI.
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tutorials.map((tutorial, index) => (
                  <Card key={index} className="bg-[#051419] border-gray-700 hover:border-blue-500 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {tutorial.type === "video" ? (
                            <Video size={16} className="text-blue-500" />
                          ) : (
                            <FileText size={16} className="text-green-500" />
                          )}
                          <Badge variant="outline" className="text-xs">
                            {tutorial.difficulty}
                          </Badge>
                        </div>
                        <ExternalLink size={16} className="text-gray-400" />
                      </div>
                      <CardTitle className="text-white text-lg">{tutorial.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {tutorial.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          {tutorial.type === "video" ? tutorial.duration : tutorial.readTime}
                        </span>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-500">
                          {tutorial.type === "video" ? "Watch" : "Read"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-[#051419] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Mail size={20} />
                    Contact Support
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Get in touch with our support team for personalized help.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm">Subject</label>
                    <Input
                      placeholder="Brief description of your issue"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">Message</label>
                    <textarea
                      placeholder="Describe your issue in detail..."
                      className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white min-h-[120px]"
                    />
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-500">
                    Send Message
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-[#051419] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Support Channels</CardTitle>
                  <CardDescription className="text-gray-400">
                    Multiple ways to get help when you need it.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <MessageCircle size={20} className="text-blue-500" />
                      <div>
                        <p className="font-medium text-white">Live Chat</p>
                        <p className="text-sm text-gray-400">Available 24/7</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-500">
                      Start Chat
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail size={20} className="text-green-500" />
                      <div>
                        <p className="font-medium text-white">Email Support</p>
                        <p className="text-sm text-gray-400">support@deeptrade.ai</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      Send Email
                    </Button>
                  </div>

                  <div className="p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <HelpCircle size={20} className="text-purple-500" />
                      <p className="font-medium text-white">Response Times</p>
                    </div>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Live Chat: Immediate</li>
                      <li>• Email: Within 24 hours</li>
                      <li>• Complex Issues: 2-3 business days</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="community" className="mt-6">
            <div className="space-y-6">
              <Card className="bg-[#051419] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users size={20} />
                    Join Our Community
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Connect with other traders and share strategies.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-700/30 rounded-lg text-center">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageCircle size={24} className="text-blue-500" />
                      </div>
                      <h3 className="font-medium text-white mb-2">Discord Server</h3>
                      <p className="text-sm text-gray-400 mb-3">
                        Real-time chat with traders and developers
                      </p>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-500">
                        Join Discord
                      </Button>
                    </div>

                    <div className="p-4 bg-gray-700/30 rounded-lg text-center">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users size={24} className="text-green-500" />
                      </div>
                      <h3 className="font-medium text-white mb-2">Telegram Group</h3>
                      <p className="text-sm text-gray-400 mb-3">
                        Strategy discussions and market insights
                      </p>
                      <Button size="sm" className="bg-green-600 hover:bg-green-500">
                        Join Telegram
                      </Button>
                    </div>

                    <div className="p-4 bg-gray-700/30 rounded-lg text-center">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Book size={24} className="text-purple-500" />
                      </div>
                      <h3 className="font-medium text-white mb-2">Forum</h3>
                      <p className="text-sm text-gray-400 mb-3">
                        In-depth discussions and tutorials
                      </p>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-500">
                        Visit Forum
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}