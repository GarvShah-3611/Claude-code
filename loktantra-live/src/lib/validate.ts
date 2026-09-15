/**
 * Client-side form rules.
 *
 * Deliberately permissive: the job of a front-end email check is to catch
 * obvious typos, not to adjudicate RFC 5322. Anything stricter starts
 * rejecting addresses that genuinely work.
 */

export function isEmail(value: string) {
  const v = value.trim();
  return v.length > 3 && v.length < 255 && /^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(v);
}

export type WorkForm = {
  name: string;
  email: string;
  type: string;
  message: string;
};

export type WorkErrors = Partial<Record<keyof WorkForm, string>>;

export function validateWork(
  values: WorkForm,
  messages: {
    name: string;
    email: string;
    message: string;
    messageShort: string;
  },
): WorkErrors {
  const errors: WorkErrors = {};
  if (!values.name.trim()) errors.name = messages.name;
  if (!isEmail(values.email)) errors.email = messages.email;
  if (!values.message.trim()) errors.message = messages.message;
  else if (values.message.trim().length < 20)
    errors.message = messages.messageShort;
  return errors;
}
