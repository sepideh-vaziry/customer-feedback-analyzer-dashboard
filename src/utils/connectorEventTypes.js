export const EVENT_TYPES_BY_SOURCE = {
  INSTAGRAM: ['comment_created', 'comment_deleted'],
  WHATSAPP: ['messages'],
  ZENDESK: ['created', 'updated', 'solved'],
  TYPEFORM: ['form_response'],
  WEBHOOK: ['event_type', 'event', 'type', 'action'],
};

export function getEventTypesForSource(source) {
  return EVENT_TYPES_BY_SOURCE[source?.toUpperCase()] || [];
}
