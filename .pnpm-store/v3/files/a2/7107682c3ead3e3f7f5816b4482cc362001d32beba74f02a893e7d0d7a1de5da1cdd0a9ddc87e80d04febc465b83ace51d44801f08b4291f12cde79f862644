import { dynamicRequire, parseUrl, getSanitizedUrlString, dynamicSamplingContextToSentryBaggageHeader, stringMatchesSomePattern } from '@sentry/utils';
import { LRUMap } from 'lru_map';
import { NODE_VERSION } from '../../nodeVersion.js';
import { isSentryRequest } from '../utils/http.js';

var ChannelName; (function (ChannelName) {
  // https://github.com/nodejs/undici/blob/e6fc80f809d1217814c044f52ed40ef13f21e43c/docs/api/DiagnosticsChannel.md#undicirequestcreate
  const RequestCreate = 'undici:request:create'; ChannelName["RequestCreate"] = RequestCreate;
  const RequestEnd = 'undici:request:headers'; ChannelName["RequestEnd"] = RequestEnd;
  const RequestError = 'undici:request:error'; ChannelName["RequestError"] = RequestError;
})(ChannelName || (ChannelName = {}));

// Please note that you cannot use `console.log` to debug the callbacks registered to the `diagnostics_channel` API.
// To debug, you can use `writeFileSync` to write to a file:
// https://nodejs.org/api/async_hooks.html#printing-in-asynchook-callbacks
//
// import { writeFileSync } from 'fs';
// import { format } from 'util';
//
// function debug(...args: any): void {
//   // Use a function like this one when debugging inside an AsyncHook callback
//   // @ts-ignore any
//   writeFileSync('log.out', `${format(...args)}\n`, { flag: 'a' });
// }

/**
 * Instruments outgoing HTTP requests made with the `undici` package via
 * Node's `diagnostics_channel` API.
 *
 * Supports Undici 4.7.0 or higher.
 *
 * Requires Node 16.17.0 or higher.
 */
class Undici  {
  /**
   * @inheritDoc
   */
   static __initStatic() {this.id = 'Undici';}

  /**
   * @inheritDoc
   */
   __init() {this.name = Undici.id;}

    __init2() {this._createSpanUrlMap = new LRUMap(100);}
    __init3() {this._headersUrlMap = new LRUMap(100);}

   constructor(_options = {}) {Undici.prototype.__init.call(this);Undici.prototype.__init2.call(this);Undici.prototype.__init3.call(this);
    this._options = {
      breadcrumbs: _options.breadcrumbs === undefined ? true : _options.breadcrumbs,
      shouldCreateSpanForRequest: _options.shouldCreateSpanForRequest,
    };
  }

  /**
   * @inheritDoc
   */
   setupOnce(_addGlobalEventProcessor, getCurrentHub) {
    // Requires Node 16+ to use the diagnostics_channel API.
    if (NODE_VERSION.major && NODE_VERSION.major < 16) {
      return;
    }

    let ds;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      ds = dynamicRequire(module, 'diagnostics_channel') ;
    } catch (e) {
      // no-op
    }

    if (!ds || !ds.subscribe) {
      return;
    }

    const shouldCreateSpan = (url) => {
      if (this._options.shouldCreateSpanForRequest === undefined) {
        return true;
      }

      const cachedDecision = this._createSpanUrlMap.get(url);
      if (cachedDecision !== undefined) {
        return cachedDecision;
      }

      const decision = this._options.shouldCreateSpanForRequest(url);
      this._createSpanUrlMap.set(url, decision);
      return decision;
    };

    // https://github.com/nodejs/undici/blob/e6fc80f809d1217814c044f52ed40ef13f21e43c/docs/api/DiagnosticsChannel.md
    ds.subscribe(ChannelName.RequestCreate, message => {
      const hub = getCurrentHub();
      if (!hub.getIntegration(Undici)) {
        return;
      }

      const { request } = message ;

      const stringUrl = request.origin ? request.origin.toString() + request.path : request.path;
      const url = parseUrl(stringUrl);

      if (isSentryRequest(stringUrl) || request.__sentry__ !== undefined) {
        return;
      }

      const client = hub.getClient();
      const scope = hub.getScope();

      const activeSpan = scope.getSpan();

      if (activeSpan && client) {
        const clientOptions = client.getOptions();

        if (shouldCreateSpan(stringUrl)) {
          const method = request.method || 'GET';
          const data = {
            'http.method': method,
          };
          if (url.search) {
            data['http.query'] = url.search;
          }
          if (url.hash) {
            data['http.fragment'] = url.hash;
          }
          const span = activeSpan.startChild({
            op: 'http.client',
            description: `${method} ${getSanitizedUrlString(url)}`,
            data,
          });
          request.__sentry__ = span;

          const shouldAttachTraceData = (url) => {
            if (clientOptions.tracePropagationTargets === undefined) {
              return true;
            }

            const cachedDecision = this._headersUrlMap.get(url);
            if (cachedDecision !== undefined) {
              return cachedDecision;
            }

            const decision = stringMatchesSomePattern(url, clientOptions.tracePropagationTargets);
            this._headersUrlMap.set(url, decision);
            return decision;
          };

          if (shouldAttachTraceData(stringUrl)) {
            request.addHeader('sentry-trace', span.toTraceparent());
            if (span.transaction) {
              const dynamicSamplingContext = span.transaction.getDynamicSamplingContext();
              const sentryBaggageHeader = dynamicSamplingContextToSentryBaggageHeader(dynamicSamplingContext);
              if (sentryBaggageHeader) {
                request.addHeader('baggage', sentryBaggageHeader);
              }
            }
          }
        }
      }
    });

    ds.subscribe(ChannelName.RequestEnd, message => {
      const hub = getCurrentHub();
      if (!hub.getIntegration(Undici)) {
        return;
      }

      const { request, response } = message ;

      const stringUrl = request.origin ? request.origin.toString() + request.path : request.path;

      if (isSentryRequest(stringUrl)) {
        return;
      }

      const span = request.__sentry__;
      if (span) {
        span.setHttpStatus(response.statusCode);
        span.finish();
      }

      if (this._options.breadcrumbs) {
        hub.addBreadcrumb(
          {
            category: 'http',
            data: {
              method: request.method,
              status_code: response.statusCode,
              url: stringUrl,
            },
            type: 'http',
          },
          {
            event: 'response',
            request,
            response,
          },
        );
      }
    });

    ds.subscribe(ChannelName.RequestError, message => {
      const hub = getCurrentHub();
      if (!hub.getIntegration(Undici)) {
        return;
      }

      const { request } = message ;

      const stringUrl = request.origin ? request.origin.toString() + request.path : request.path;

      if (isSentryRequest(stringUrl)) {
        return;
      }

      const span = request.__sentry__;
      if (span) {
        span.setStatus('internal_error');
        span.finish();
      }

      if (this._options.breadcrumbs) {
        hub.addBreadcrumb(
          {
            category: 'http',
            data: {
              method: request.method,
              url: stringUrl,
            },
            level: 'error',
            type: 'http',
          },
          {
            event: 'error',
            request,
          },
        );
      }
    });
  }
} Undici.__initStatic();

export { ChannelName, Undici };
//# sourceMappingURL=index.js.map
