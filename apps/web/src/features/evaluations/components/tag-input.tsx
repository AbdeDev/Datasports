import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { type KeyboardEvent, useState } from "react";

export function TagInput({
  label,
  values,
  onChange,
  maxItems = 3,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  maxItems?: number;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function addTag() {
    const trimmed = draft.trim();
    if (!trimmed || values.length >= maxItems || values.includes(trimmed)) {
      return;
    }
    onChange([...values, trimmed]);
    setDraft("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
    }
  }

  function removeTag(tag: string) {
    onChange(values.filter((value) => value !== tag));
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1.5 pr-1.5">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {values.length < maxItems && (
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
          />
          <Button type="button" variant="outline" onClick={addTag} disabled={!draft.trim()}>
            Ajouter
          </Button>
        </div>
      )}
    </div>
  );
}
