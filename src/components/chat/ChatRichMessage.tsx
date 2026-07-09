import { Link } from 'react-router-dom';
import { Clock, MapPin, Sparkles, Star, Utensils, Compass } from 'lucide-react';
import type { ChatCard } from '../../types/chat';

function ChatRouteCardView({ card }: { card: Extract<ChatCard, { type: 'route' }> }) {
  return (
    <Link
      to={`/route/${card.id}`}
      className="block rounded-2xl overflow-hidden border border-surface-variant bg-surface shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all group"
    >
      <div className="relative h-28 overflow-hidden">
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <span
          className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm"
          style={{ backgroundColor: card.categoryBg, color: card.categoryColor }}
        >
          {card.categoryLabel}
        </span>
        <span className="absolute top-2 right-2 flex items-center gap-0.5 bg-violet-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          <Sparkles className="w-3 h-3" /> {card.aiMatch}%
        </span>
        <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-bold line-clamp-2 leading-snug">
          {card.title}
        </p>
      </div>
      <div className="px-3 py-2.5 flex items-center justify-between gap-2 text-[11px] text-secondary">
        <span className="flex items-center gap-1 min-w-0">
          <MapPin className="w-3 h-3 text-primary shrink-0" />
          <span className="truncate">{card.district}</span>
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <Clock className="w-3 h-3 text-primary" />
          {card.duration}
        </span>
        <span className="text-primary font-bold shrink-0">฿{card.price.toLocaleString()}</span>
      </div>
    </Link>
  );
}

function ChatCommunityCardView({ card }: { card: Extract<ChatCard, { type: 'community' }> }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white shadow-md">
      <div className="relative h-24 overflow-hidden">
        <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-900/30 to-transparent" />
        <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          ชุมชนที่ {card.no}
        </span>
        <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-bold">{card.name}</p>
      </div>
      <div className="p-3 space-y-2">
        <p className="text-[11px] text-on-surface leading-relaxed line-clamp-2">{card.hook}</p>
        <div className="flex flex-wrap gap-1">
          {card.activities.slice(0, 2).map((a) => (
            <span
              key={a}
              className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800"
            >
              {a}
            </span>
          ))}
          {card.food[0] && (
            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-800 flex items-center gap-0.5">
              <Utensils className="w-2.5 h-2.5" />
              {card.food[0]}
            </span>
          )}
        </div>
        <p className="text-[10px] text-secondary flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {card.district}
        </p>
      </div>
    </div>
  );
}

function ChatLandmarkCardView({ card }: { card: Extract<ChatCard, { type: 'landmark' }> }) {
  return (
    <div className="rounded-xl border border-sky-200 bg-gradient-to-r from-sky-50 to-white p-3 flex gap-3 shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0">
        <Compass className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-on-surface flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
          {card.name}
        </p>
        <p className="text-[10px] text-secondary mt-0.5">{card.district}</p>
        <p className="text-[11px] text-on-surface-variant mt-1 line-clamp-2">{card.hook}</p>
      </div>
    </div>
  );
}

export function ChatRecommendationCards({ cards }: { cards: ChatCard[] }) {
  if (!cards.length) return null;

  return (
    <div className="mt-2 space-y-2 w-full">
      {cards.map((card) => {
        if (card.type === 'route') {
          return <ChatRouteCardView key={`route-${card.id}`} card={card} />;
        }
        if (card.type === 'community') {
          return <ChatCommunityCardView key={`community-${card.no}`} card={card} />;
        }
        return <ChatLandmarkCardView key={`landmark-${card.id}`} card={card} />;
      })}
    </div>
  );
}

export function ChatMessageBody({
  text,
  cards,
  compact,
}: {
  text: string;
  cards?: ChatCard[];
  compact?: boolean;
}) {
  const parts = text.split(/\n---\n/);
  const main = parts[0];
  const notice = parts[1]?.replace(/^⚠️\s*/, '');
  const textClass = compact ? 'text-xs leading-relaxed' : 'text-[15px] leading-relaxed';

  return (
    <>
      <p className={`${textClass} whitespace-pre-wrap`}>{main}</p>
      {cards && cards.length > 0 && <ChatRecommendationCards cards={cards} />}
      {notice && (
        <p className="mt-2 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5 leading-relaxed">
          ⚠️ {notice}
        </p>
      )}
    </>
  );
}
