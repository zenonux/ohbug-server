import type {
  UncaughtErrorDetail,
  UnhandledrejectionErrorDetail,
  UnknownErrorDetail,
  ResourceErrorDetail,
  AjaxErrorDetail,
  FetchErrorDetail,
  WebsocketErrorDetail,
} from '@ohbug/browser';
import type { ReactErrorDetail } from '@ohbug/react';
import type { VueErrorDetail } from '@ohbug/vue';

export type OhbugEventDetail = UncaughtErrorDetail &
  UnhandledrejectionErrorDetail &
  UnknownErrorDetail &
  ResourceErrorDetail &
  AjaxErrorDetail &
  FetchErrorDetail &
  WebsocketErrorDetail &
  ReactErrorDetail &
  VueErrorDetail;
