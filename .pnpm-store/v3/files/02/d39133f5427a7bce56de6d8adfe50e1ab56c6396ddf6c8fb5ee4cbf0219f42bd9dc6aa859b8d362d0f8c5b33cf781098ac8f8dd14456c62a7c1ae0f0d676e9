import type { EventProcessor, Hub, Integration } from '@sentry/types';
import type { Debugger, InspectorNotification } from 'inspector';
declare type Variables = Record<string, unknown>;
declare type OnPauseEvent = InspectorNotification<Debugger.PausedEventDataType>;
export interface DebugSession {
    /** Configures and connects to the debug session */
    configureAndConnect(onPause: (message: OnPauseEvent, complete: () => void) => void, captureAll: boolean): void;
    /** Gets local variables for an objectId */
    getLocalVariables(objectId: string, callback: (vars: Variables) => void): void;
}
declare type Next<T> = (result: T) => void;
declare type Add<T> = (fn: Next<T>) => void;
declare type CallbackWrapper<T> = {
    add: Add<T>;
    next: Next<T>;
};
/** Creates a container for callbacks to be called sequentially */
export declare function createCallbackList<T>(complete: Next<T>): CallbackWrapper<T>;
export interface FrameVariables {
    function: string;
    vars?: Variables;
}
/** There are no options yet. This allows them to be added later without breaking changes */
interface Options {
    /**
     * Capture local variables for both handled and unhandled exceptions
     *
     * Default: false - Only captures local variables for uncaught exceptions
     */
    captureAllExceptions?: boolean;
}
/**
 * Adds local variables to exception frames
 */
export declare class LocalVariables implements Integration {
    private readonly _options;
    private readonly _session;
    static id: string;
    readonly name: string;
    private readonly _cachedFrames;
    constructor(_options?: Options, _session?: DebugSession | undefined);
    /**
     * @inheritDoc
     */
    setupOnce(addGlobalEventProcessor: (callback: EventProcessor) => void, getCurrentHub: () => Hub): void;
    /** Setup in a way that's easier to call from tests */
    private _setup;
    /**
     * Handle the pause event
     */
    private _handlePaused;
    /**
     * Adds local variables event stack frames.
     */
    private _addLocalVariables;
    /**
     * Adds local variables to the exception stack frames.
     */
    private _addLocalVariablesToException;
}
export {};
//# sourceMappingURL=localvariables.d.ts.map