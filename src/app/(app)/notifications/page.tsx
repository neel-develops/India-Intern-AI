
'use client';
import { useNotifications } from '@/hooks/use-notifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bell, CheckCheck } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Here are your recent updates.
          </p>
        </div>
        <Button onClick={markAllAsRead} variant="outline">
            <CheckCheck className="mr-2 h-4 w-4"/>
            Mark all as read
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="space-y-2">
            {notifications.length > 0 ? (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={cn(
                    "p-4 border-b flex items-start gap-4 transition-colors",
                    !n.read && "bg-accent/50",
                  )}
                >
                    <div className="mt-1">
                        <Bell className={cn("h-5 w-5", n.read ? "text-muted-foreground" : "text-primary")} />
                    </div>
                    <div className="flex-grow">
                        <Link href={n.link || '#'} className="hover:underline">
                            <p className={cn("font-medium", !n.read && "font-bold text-foreground")}>{n.message}</p>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">{new Date(n.date).toLocaleString()}</p>
                    </div>
                    {!n.read && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(n.id)}>
                            Mark as read
                        </Button>
                    )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Bell className="mx-auto h-12 w-12" />
                <p className="mt-4">You have no notifications.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
