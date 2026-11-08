import site from '../../config/site';

export default function AnnouncementBar() {
  if (!site.announcementMessage) return null;
  return (
    <div className="bg-ink-900 py-2 text-center text-xs text-cream-50">
      {site.announcementMessage}
    </div>
  );
}
