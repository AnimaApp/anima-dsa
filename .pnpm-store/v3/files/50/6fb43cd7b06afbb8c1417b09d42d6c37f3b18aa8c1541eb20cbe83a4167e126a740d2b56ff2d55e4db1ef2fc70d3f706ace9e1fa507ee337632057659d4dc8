import type { ClientOptions, Event, EventHint, StackParser } from '@sentry/types';
import { Scope } from '../scope';
/**
 * Adds common information to events.
 *
 * The information includes release and environment from `options`,
 * breadcrumbs and context (extra, tags and user) from the scope.
 *
 * Information that is already present in the event is never overwritten. For
 * nested objects, such as the context, keys are merged.
 *
 * Note: This also triggers callbacks for `addGlobalEventProcessor`, but not `beforeSend`.
 *
 * @param event The original event.
 * @param hint May contain additional information about the original exception.
 * @param scope A scope containing event metadata.
 * @returns A new event with more information.
 * @hidden
 */
export declare function prepareEvent(options: ClientOptions, event: Event, hint: EventHint, scope?: Scope): PromiseLike<Event | null>;
/**
 * Applies debug metadata images to the event in order to apply source maps by looking up their debug ID.
 */
export declare function applyDebugMetadata(event: Event, stackParser: StackParser): void;
//# sourceMappingURL=prepareEvent.d.ts.map