import { useNotifications } from '@/hooks/use-notifications';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

function groupByDate(notifications: any[]) {
  const groups: Record<string, any[]> = {};
  for (const n of notifications) {
    const date = parseISO(n.date);
    let label: string;
    if (isToday(date)) label = 'Today';
    else if (isYesterday(date)) label = 'Yesterday';
    else label = format(date, 'MMMM d, yyyy');
    if (!groups[label]) groups[label] = [];
    groups[label].push(n);
  }
  return groups;
}

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;
  const grouped = groupByDate(notifications);

  return (
    <div className="container mx-auto max-w-3xl py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Bell className="h-7 w-7 text-violet-400" />
            Notifications
          </h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-muted/30 rounded-2xl">
          <Bell className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No notifications yet</h3>
          <p className="text-sm text-muted-foreground">Apply to internships to get started!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">{date}</p>
              <div className="rounded-2xl border bg-card/60 backdrop-blur-sm divide-y overflow-hidden">
                {items.map(n => (
                  <div
                    key={n.id}
                    className={cn(
                      'flex items-start gap-4 p-4 transition-colors',
                      !n.read && 'bg-violet-500/5 border-l-2 border-l-violet-500'
                    )}
                  >
                    <div className="mt-1 shrink-0">
                      {n.read
                        ? <Bell className="h-4 w-4 text-muted-foreground" />
                        : <Circle className="h-2.5 w-2.5 text-violet-500 fill-violet-500 mt-1" />
                      }
                    </div>
                    <div className="flex-grow min-w-0">
                      {n.link ? (
                        <Link to={n.link} className="hover:underline" onClick={() => markAsRead(n.id)}>
                          <p className={cn('text-sm', !n.read ? 'font-semibold text-foreground' : 'text-muted-foreground')}>{n.message}</p>
                        </Link>
                      ) : (
                        <p className={cn('text-sm', !n.read ? 'font-semibold text-foreground' : 'text-muted-foreground')}>{n.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{format(parseISO(n.date), 'h:mm a')}</p>
                    </div>
                    {!n.read && (
                      <Button variant="ghost" size="sm" className="shrink-0 text-xs h-7" onClick={() => markAsRead(n.id)}>
                        Mark read
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
