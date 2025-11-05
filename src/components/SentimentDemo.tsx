import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, SmilePlus, Meh, Frown } from "lucide-react";
import { toast } from "sonner";

export const SentimentDemo = () => {
  const [comment, setComment] = useState("");
  const [result, setResult] = useState<{
    sentiment: "positive" | "neutral" | "negative";
    confidence: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Improved detector: combines emoji scanning and simple lexicon/negation handling for better accuracy
  const detectSentiment = (text: string): { sentiment: "positive" | "neutral" | "negative"; confidence: number } | null => {
    if (!text || !text.trim()) return null;

    // Emoji-first pass (fast and usually reliable). We'll count by simple character inclusion to avoid regex pitfalls.
    const positiveEmojis = new Set(['😊','😃','😄','😁','🙂','😀','😍','🥰','😘','🤗','🎉','👍','❤️','💖','✨','🌟','💯']);
    const negativeEmojis = new Set(['😢','😭','😞','😔','☹️','🙁','😣','😖','😫','😩','😤','😠','😡','💔','👎']);
    const neutralEmojis = new Set(['😐','😑','🤔','😶','🙄','🤷']);

    let posEmoji = 0;
    let negEmoji = 0;
    let neuEmoji = 0;

    for (const ch of Array.from(text)) {
      if (positiveEmojis.has(ch)) posEmoji++;
      else if (negativeEmojis.has(ch)) negEmoji++;
      else if (neutralEmojis.has(ch)) neuEmoji++;
    }

    const totalEmoji = posEmoji + negEmoji + neuEmoji;

    // Word/lexicon pass
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9'_\s]/g, " ");
    const tokens = normalize(text).split(/\s+/).filter(Boolean);

    const positiveWords = new Set(["good","great","awesome","amazing","love","loved","like","liked","fantastic","excellent","best","nice","happy","joy","glad","wonderful","helpful","brilliant","recommend","cool"]);
    const negativeWords = new Set(["bad","terrible","awful","hate","hated","dislike","disliked","worst","poor","sad","angry","disappointed","disappointing","broken","bug","spam","boring","annoying","trash","waste"]);
    const negations = new Set(["not","never","no","dont","doesnt","didnt","isnt","wasnt","cant","cannot","wont","won't"]);
    const intensifiers = new Set(["very","really","extremely","super","totally","completely","absolutely","so"]);

    let score = 0;
    for (let i = 0; i < tokens.length; i++) {
      const w = tokens[i];
      if (positiveWords.has(w)) {
        let weight = 1;
        if (i > 0 && intensifiers.has(tokens[i-1])) weight *= 1.6;
        if (i > 0 && negations.has(tokens[i-1])) weight *= -1;
        score += weight;
      } else if (negativeWords.has(w)) {
        let weight = -1;
        if (i > 0 && intensifiers.has(tokens[i-1])) weight *= 1.6;
        if (i > 0 && negations.has(tokens[i-1])) weight *= -1;
        score += weight;
      }
    }

    // Convert word score into a normalized sentiment and confidence
    const wordMagnitude = Math.abs(score);
    const wordSentiment = score > 0.5 ? "positive" : score < -0.5 ? "negative" : "neutral";
    // confidence based on magnitude and token count (avoids overly confident short matches)
    const wordConfidence = Math.min(0.95, 0.6 + Math.min(1, wordMagnitude / Math.max(1, Math.sqrt(tokens.length))) * 0.35);

    // If we detected emojis, combine emoji signal + word signal (emoji usually stronger)
    if (totalEmoji > 0) {
      // Determine dominant emoji sentiment
      const emojiSentiment = posEmoji > negEmoji && posEmoji > neuEmoji ? "positive" : negEmoji > posEmoji && negEmoji > neuEmoji ? "negative" : "neutral";
      // Emoji confidence scales with prevalence
      const emojiConfidenceBase = 0.75 + Math.min(0.2, totalEmoji / 10);
      // Combine confidences, weight emoji more
      const combinedConfidence = Math.min(0.98, emojiConfidenceBase * 0.75 + wordConfidence * 0.25);

      // If word sentiment agrees, boost confidence slightly
      let finalSentiment = emojiSentiment as "positive" | "neutral" | "negative";
      if (wordSentiment !== "neutral" && wordSentiment === emojiSentiment) {
        return { sentiment: finalSentiment, confidence: Math.min(0.99, combinedConfidence + 0.03) };
      }
      // If they disagree but emoji count is dominant, prefer emoji; otherwise prefer word
      if (Math.abs(posEmoji - negEmoji) >= 1) {
        return { sentiment: finalSentiment, confidence: combinedConfidence };
      }
      // fallback: rely on word sentiment
      return { sentiment: wordSentiment as "positive" | "neutral" | "negative", confidence: wordConfidence };
    }

    // No emojis -> use word-based result
    if (tokens.length === 0) return null;
    return { sentiment: wordSentiment as "positive" | "neutral" | "negative", confidence: wordConfidence };
  };

  const analyzeSentiment = async () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment to analyze");
      return;
    }

    setLoading(true);
    
    // Use improved detector (combines emojis + lexicon)
    setTimeout(() => {
      const detected = detectSentiment(comment);
      if (detected) setResult(detected);
      else toast.error("Couldn't detect sentiment. Try a longer comment or add some context/emojis.");
      setLoading(false);
    }, 600);
  };

  const getSentimentIcon = () => {
    if (!result) return null;
    
    switch (result.sentiment) {
      case "positive":
        return <SmilePlus className="w-16 h-16 text-green-400" />;
      case "neutral":
        return <Meh className="w-16 h-16 text-yellow-400" />;
      case "negative":
        return <Frown className="w-16 h-16 text-red-400" />;
    }
  };

  const getSentimentColor = () => {
    if (!result) return "";
    
    switch (result.sentiment) {
      case "positive":
        return "from-green-500/20 to-emerald-500/20 border-green-500/30";
      case "neutral":
        return "from-yellow-500/20 to-amber-500/20 border-yellow-500/30";
      case "negative":
        return "from-red-500/20 to-rose-500/20 border-red-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Textarea
          placeholder="Enter a YouTube comment here to analyze its sentiment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-32 resize-none bg-card/50 backdrop-blur-sm border-primary/20 focus:border-primary/50 transition-colors"
        />
        <Button
          onClick={analyzeSentiment}
          disabled={loading}
          className="w-full bg-gradient-primary hover-glow"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Sentiment"
          )}
        </Button>
      </div>

      {result && (
        <Card 
          className={`p-6 bg-gradient-to-br ${getSentimentColor()} backdrop-blur-sm animate-scale-in`}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            {getSentimentIcon()}
            <div>
              <h3 className="text-2xl font-bold capitalize mb-2">{result.sentiment}</h3>
              <p className="text-muted-foreground">
                Confidence: {(result.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
