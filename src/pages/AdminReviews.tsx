import { useEffect, useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { useNavigate, Link } from "react-router-dom";
import { useAdminApi } from "@/hooks/useAdminApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, Trash2, MessageSquare, Plus, LogOut, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface ReviewItem {
  id: string;
  retreat_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  admin_reply: string | null;
  status: string;
  created_at: string;
  retreats: { title: string } | null;
}

interface RetreatOption {
  id: string;
  title: string;
}

export default function AdminReviews() {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const { adminFetch } = useAdminApi();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [retreats, setRetreats] = useState<RetreatOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    retreat_id: "",
    reviewer_name: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin-login");
      return;
    }
    fetchReviews();
    fetchRetreats();
  }, [isAdmin]);

  const fetchReviews = async () => {
    try {
      const data = await adminFetch("admin-reviews");
      setReviews(data);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchRetreats = async () => {
    try {
      const data = await adminFetch("admin-retreats");
      setRetreats(data.map((r: any) => ({ id: r.id, title: r.title })));
    } catch {}
  };

  const handleReply = async (reviewId: string) => {
    try {
      await adminFetch("admin-reviews", {
        method: "PUT",
        body: JSON.stringify({ id: reviewId, admin_reply: replyText }),
      });
      toast.success("Reply saved");
      setReplyingTo(null);
      setReplyText("");
      fetchReviews();
    } catch {
      toast.error("Failed to save reply");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await adminFetch(`admin-reviews?id=${id}`, { method: "DELETE" });
      toast.success("Review deleted");
      fetchReviews();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggleStatus = async (review: ReviewItem) => {
    const newStatus = review.status === "approved" ? "hidden" : "approved";
    try {
      await adminFetch("admin-reviews", {
        method: "PUT",
        body: JSON.stringify({ id: review.id, status: newStatus }),
      });
      toast.success(`Review ${newStatus}`);
      fetchReviews();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleAddReview = async () => {
    if (!newReview.retreat_id || !newReview.reviewer_name || !newReview.comment) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await adminFetch("admin-reviews", {
        method: "POST",
        body: JSON.stringify(newReview),
      });
      toast.success("Review added");
      setAddOpen(false);
      setNewReview({ retreat_id: "", reviewer_name: "", rating: 5, comment: "" });
      fetchReviews();
    } catch {
      toast.error("Failed to add review");
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-serif text-xl text-foreground">Kinturi</Link>
          <span className="text-muted-foreground text-sm">/ Admin CMS / Reviews</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <h1 className="font-serif text-3xl text-foreground">Reviews</h1>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button variant="sage" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add Review
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Review</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Retreat</Label>
                  <Select value={newReview.retreat_id} onValueChange={(v) => setNewReview({ ...newReview, retreat_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select retreat" /></SelectTrigger>
                    <SelectContent>
                      {retreats.map((r) => (
                        <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Reviewer Name</Label>
                  <Input value={newReview.reviewer_name} onChange={(e) => setNewReview({ ...newReview, reviewer_name: e.target.value })} />
                </div>
                <div>
                  <Label>Rating</Label>
                  <Select value={String(newReview.rating)} onValueChange={(v) => setNewReview({ ...newReview, rating: Number(v) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[5, 4, 3, 2, 1].map((r) => (
                        <SelectItem key={r} value={String(r)}>{r} star{r > 1 ? "s" : ""}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Comment</Label>
                  <Textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} rows={4} />
                </div>
                <Button variant="sage" className="w-full" onClick={handleAddReview}>Add Review</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground mb-4">No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-card border border-border rounded-lg p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-medium text-foreground">{review.reviewer_name}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-accent fill-accent" : "text-border"}`} />
                        ))}
                      </div>
                      <Badge variant={review.status === "approved" ? "default" : "secondary"}>{review.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {review.retreats?.title || "Unknown retreat"} · {new Date(review.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-body text-sm">{review.comment}</p>
                    {review.admin_reply && (
                      <div className="mt-3 ml-4 pl-4 border-l-2 border-primary/30">
                        <p className="text-xs font-medium text-primary mb-1">Your reply</p>
                        <p className="text-body text-sm">{review.admin_reply}</p>
                      </div>
                    )}
                    {replyingTo === review.id && (
                      <div className="mt-3 space-y-2">
                        <Textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply..."
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button variant="sage" size="sm" onClick={() => handleReply(review.id)}>Save Reply</Button>
                          <Button variant="ghost" size="sm" onClick={() => { setReplyingTo(null); setReplyText(""); }}>Cancel</Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setReplyingTo(review.id);
                        setReplyText(review.admin_reply || "");
                      }}
                      title="Reply"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(review)}
                      title={review.status === "approved" ? "Hide" : "Approve"}
                    >
                      {review.status === "approved" ? "Hide" : "Approve"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(review.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
