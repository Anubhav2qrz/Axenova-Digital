import { useState, useEffect, useCallback } from "react";
import { Star, MessageSquarePlus, User, Briefcase, Quote, ThumbsUp, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Review {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  date: string;
  helpful: number;
}



const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name: string) => {
  const colors = [
    "from-blue-500 to-cyan-400",
    "from-purple-500 to-pink-400",
    "from-emerald-500 to-teal-400",
    "from-orange-500 to-amber-400",
    "from-rose-500 to-red-400",
    "from-indigo-500 to-violet-400",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};


const StarRatingInput = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="p-0.5 transition-transform hover:scale-125 focus:outline-none"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            size={24}
            className={`transition-colors duration-150 ${
              star <= (hover || value)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
};


const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={14}
        className={
          star <= rating
            ? "fill-amber-400 text-amber-400"
            : "text-muted-foreground/20"
        }
      />
    ))}
  </div>
);

const REVIEWS_PER_PAGE = 6;

const ReviewsSection = () => {
  const ref = useScrollAnimation();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [helpedIds, setHelpedIds] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({
    name: "",
    role: "",
    text: "",
    rating: 0,
  });

  useEffect(() => {
    const fetchReviews = async () => {

      try {
        const { data, error } = await supabase.from('reviews').select('*').order('date', { ascending: false });
        if (data && !error) {
          setUserReviews(data);
        }
      } catch (err) {
        console.warn("Supabase fetch failed, make sure table is created", err);
      }
    };
    fetchReviews();

    try {
      const stored = localStorage.getItem("axenova_helped_ids");
      if (stored) setHelpedIds(new Set(JSON.parse(stored)));
    } catch {
    }
  }, []);

  const allReviews = [...userReviews].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalPages = Math.ceil(allReviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = allReviews.slice(
    currentPage * REVIEWS_PER_PAGE,
    (currentPage + 1) * REVIEWS_PER_PAGE
  );

  const averageRating =
    allReviews.length > 0
      ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.text.trim() || form.rating === 0) {
      toast({
        title: "Please fill in all required fields",
        description: "Name, review, and star rating are required.",
        variant: "destructive",
      });
      return;
    }

    if (form.text.trim().length < 10) {
      toast({
        title: "Review too short",
        description: "Please write at least 10 characters.",
        variant: "destructive",
      });
      return;
    }

    const newReview = {
      name: form.name.trim(),
      role: form.role.trim() || "Customer",
      text: form.text.trim(),
      rating: form.rating,
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
    };


    const reviewWithId = { ...newReview, id: `temp-${Date.now()}` } as Review;
    const updated = [reviewWithId, ...userReviews];
    setUserReviews(updated);

    try {
      await supabase.from('reviews').insert([newReview]);
    } catch (err) {
      console.error("Failed to insert review into database", err);
    }

    setForm({ name: "", role: "", text: "", rating: 0 });
    setDialogOpen(false);
    setCurrentPage(0);

    toast({
      title: "Thank you for your review! ✨",
      description: "Your review has been published successfully.",
    });
  };

  const handleHelpful = useCallback(
    async (id: string) => {
      if (helpedIds.has(id)) return;

      const newHelped = new Set(helpedIds);
      newHelped.add(id);
      setHelpedIds(newHelped);
      localStorage.setItem(
        "axenova_helped_ids",
        JSON.stringify([...newHelped])
      );


      const updatedUser = userReviews.map((r) =>
        r.id === id ? { ...r, helpful: r.helpful + 1 } : r
      );
      setUserReviews(updatedUser);
      
      const review = userReviews.find((r) => r.id === id);
      if (review && !id.startsWith('temp-')) {
        await supabase.from('reviews').update({ helpful: review.helpful + 1 }).eq('id', id);
      }
    },
    [helpedIds, userReviews]
  );

  return (
    <section id="reviews" className="py-24 relative">

      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div ref={ref} className="container relative z-10">

        <div className="text-center mb-16 opacity-0 animate-on-scroll">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Reviews
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Real reviews from real clients. See why businesses trust Axenova
            Digital.
          </p>


          <div className="inline-flex items-center gap-6 glass rounded-full px-6 py-3">
            {allReviews.length > 0 && (
              <>
                <div className="flex items-center gap-2">
                  <StarDisplay rating={Math.round(averageRating)} />
                  <span className="font-semibold text-sm">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <div className="w-px h-5 bg-border" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {allReviews.length}
                  </span>{" "}
                  {allReviews.length === 1 ? "review" : "reviews"}
                </span>
                <div className="w-px h-5 bg-border" />
              </>
            )}
            <Button
              variant="hero"
              size="sm"
              onClick={() => setDialogOpen(true)}
              className="gap-1.5"
              id="write-review-btn"
            >
              <MessageSquarePlus size={16} />
              Write a Review
            </Button>
          </div>
        </div>


        {allReviews.length === 0 && (
          <div className="text-center py-16 opacity-0 animate-on-scroll">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <MessageCircle size={36} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">No reviews yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Be the first to share your experience working with Axenova Digital. Your feedback helps others make informed decisions.
            </p>
            <Button
              variant="hero"
              size="lg"
              onClick={() => setDialogOpen(true)}
              className="gap-2"
            >
              <MessageSquarePlus size={18} />
              Write the First Review
            </Button>
          </div>
        )}


        {allReviews.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {paginatedReviews.map((review, i) => (
              <div
                key={review.id}
                className="glass rounded-xl p-6 hover-lift opacity-0 animate-on-scroll flex flex-col relative group"
                style={{ animationDelay: `${i * 0.08}s` }}
              >

                <Quote
                  size={32}
                  className="absolute top-4 right-4 text-primary/10 group-hover:text-primary/20 transition-colors"
                />


                <div className="mb-4">
                  <StarDisplay rating={review.rating} />
                </div>


                <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-1">
                  "{review.text}"
                </p>


                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">

                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(
                        review.name
                      )} flex items-center justify-center text-white text-xs font-bold shadow-md`}
                    >
                      {getInitials(review.name)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{review.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {review.role}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground/60">
                      {formatDate(review.date)}
                    </span>
                    <button
                      onClick={() => handleHelpful(review.id)}
                      disabled={helpedIds.has(review.id)}
                      className={`flex items-center gap-1 text-xs transition-colors ${
                        helpedIds.has(review.id)
                          ? "text-accent cursor-default"
                          : "text-muted-foreground/50 hover:text-accent cursor-pointer"
                      }`}
                      title="Mark as helpful"
                    >
                      <ThumbsUp size={12} />
                      <span>{review.helpful}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}


        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10 opacity-0 animate-on-scroll">
            <Button
              variant="hero-outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="h-9 w-9"
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === currentPage
                      ? "bg-accent w-6"
                      : "bg-muted-foreground/20 hover:bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
            <Button
              variant="hero-outline"
              size="icon"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
              }
              disabled={currentPage === totalPages - 1}
              className="h-9 w-9"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>


      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience working with Axenova Digital.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-2">

            <div>
              <label className="text-sm font-medium mb-2 block">
                Your Rating <span className="text-accent">*</span>
              </label>
              <StarRatingInput
                value={form.rating}
                onChange={(v) => setForm({ ...form, rating: v })}
              />
            </div>


            <div>
              <label className="text-sm font-medium mb-2 block">
                Your Name <span className="text-accent">*</span>
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={50}
                  className="bg-secondary/50 border-border pl-9"
                />
              </div>
            </div>


            <div>
              <label className="text-sm font-medium mb-2 block">
                Your Role / Company{" "}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </label>
              <div className="relative">
                <Briefcase
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="CEO, Acme Inc."
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  maxLength={60}
                  className="bg-secondary/50 border-border pl-9"
                />
              </div>
            </div>


            <div>
              <label className="text-sm font-medium mb-2 block">
                Your Review <span className="text-accent">*</span>
              </label>
              <Textarea
                placeholder="Tell us about your experience…"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                maxLength={500}
                rows={4}
                className="bg-secondary/50 border-border resize-none"
              />
              <div className="text-xs text-muted-foreground/50 mt-1 text-right">
                {form.text.length}/500
              </div>
            </div>

            <Button variant="hero" className="w-full" type="submit">
              Submit Review
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReviewsSection;
