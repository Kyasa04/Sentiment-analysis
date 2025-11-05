import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, BarChart3, MessageSquare, Github, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SentimentDemo } from "@/components/SentimentDemo";
import heroBanner from "@/assets/hero-banner.jpg";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Index = () => {
  const { user, logout } = useAuth();
  
  const sentimentData = [
    { name: "Positive", value: 45, color: "#4ade80" },
    { name: "Neutral", value: 30, color: "#fbbf24" },
    { name: "Negative", value: 25, color: "#f87171" },
  ];

  const teamMembers = [
    { name: "Team Member 1", role: "ML Engineer" },
    { name: "Team Member 2", role: "Data Scientist" },
    { name: "Team Member 3", role: "Frontend Developer" },
    { name: "Team Member 4", role: "Backend Developer" },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gradient">Sentiment Analysis</h2>
          <div className="flex items-center gap-4">
            <a href="#about" className="text-foreground/80 hover:text-foreground transition-colors hidden md:inline">
              About
            </a>
            <a href="#demo" className="text-foreground/80 hover:text-foreground transition-colors hidden md:inline">
              Demo
            </a>
            <a href="#team" className="text-foreground/80 hover:text-foreground transition-colors hidden md:inline">
              Team
            </a>
            <span className="text-sm text-muted-foreground hidden md:inline">
              {user?.email}
            </span>
            <Button 
              onClick={logout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-hero animate-gradient opacity-50" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroBanner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in">
          <div className="mb-8 inline-block p-4 bg-card/30 backdrop-blur-sm rounded-full">
            <Brain className="w-16 h-16 text-primary animate-float" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
            Sentiment Analysis of
            <br />
            YouTube Comments
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Understanding Emotions Behind Every Comment
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#demo" className="inline-block">
              <button className="px-8 py-4 bg-gradient-primary hover-glow rounded-full font-semibold text-lg">
                Try Demo
              </button>
            </a>
            <a href="#about" className="inline-block">
              <button className="px-8 py-4 bg-card/50 backdrop-blur-sm hover-glow rounded-full font-semibold text-lg border border-primary/30">
                Learn More
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">What is Sentiment Analysis?</h2>
            <p className="text-muted-foreground text-lg">
              Sentiment analysis is a natural language processing technique that determines
              the emotional tone behind text. It's crucial for understanding audience
              reactions, improving content strategy, and gaining insights into public opinion.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover-glow">
              <div className="text-green-400 text-3xl mb-3">😊</div>
              <h3 className="font-semibold mb-2 text-lg">Positive</h3>
              <p className="text-sm text-muted-foreground">
                Identifies comments expressing happiness, satisfaction, and approval
              </p>
            </Card>
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover-glow">
              <div className="text-yellow-400 text-3xl mb-3">😐</div>
              <h3 className="font-semibold mb-2 text-lg">Neutral</h3>
              <p className="text-sm text-muted-foreground">
                Detects factual, objective comments without strong emotions
              </p>
            </Card>
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover-glow">
              <div className="text-red-400 text-3xl mb-3">😞</div>
              <h3 className="font-semibold mb-2 text-lg">Negative</h3>
              <p className="text-sm text-muted-foreground">
                Recognizes comments showing dissatisfaction, criticism, or anger
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12 animate-fade-in">
            <Brain className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Try It Yourself</h2>
            <p className="text-muted-foreground text-lg">
              Enter any YouTube comment and see our AI analyze its sentiment in real-time
            </p>
          </div>
          <SentimentDemo />
        </div>
      </section>

      {/* Visualization Section */}
      <section id="visualization" className="py-20 px-4 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in">
            <BarChart3 className="w-12 h-12 text-accent mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Sentiment Distribution</h2>
            <p className="text-muted-foreground text-lg">
              Visualizing patterns in YouTube comment sentiments
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-xl font-semibold mb-4 text-center">Pie Chart View</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <h3 className="text-xl font-semibold mb-4 text-center">Bar Chart View</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sentimentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a2e",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">Our Team</h2>
            <p className="text-muted-foreground text-lg">
              Meet the brilliant minds behind this project
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="p-6 text-center bg-card/50 backdrop-blur-sm border-primary/20 hover-glow"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center text-4xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-primary/20 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">
              © 2025 Sentiment Analysis Project. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
              <a
                href="mailto:contact@example.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
