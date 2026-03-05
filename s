
> marketscrape-ui@0.0.0 type
> tsc -b --noEmit

src/features/auth/hooks/auth.hook.ts:9:1 - error TS6133: 'ReactNode' is declared but its value is never read.

9 import type { ReactNode } from 'react'
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

src/features/search/components/SearchCard/SearchCard.tsx:123:30 - error TS2551: Property 'notifications' does not exist on type '{ frequency: "every_1h" | "every_2h" | "every_6h" | "every_12h" | "every_24h"; listingsPerCheck: number; notificationType: "email" | "sms" | "webhook"; notificationTarget: string; }'. Did you mean 'notificationType'?

123             {search.settings.notifications.length > 0
                                 ~~~~~~~~~~~~~

  src/generated/types.gen.ts:304:17
    304                 notificationType: 'email' | 'sms' | 'webhook';
                        ~~~~~~~~~~~~~~~~
    'notificationType' is declared here.

src/features/search/components/SearchCard/SearchCard.tsx:124:33 - error TS2551: Property 'notifications' does not exist on type '{ frequency: "every_1h" | "every_2h" | "every_6h" | "every_12h" | "every_24h"; listingsPerCheck: number; notificationType: "email" | "sms" | "webhook"; notificationTarget: string; }'. Did you mean 'notificationType'?

124               ? search.settings.notifications.join(", ")
                                    ~~~~~~~~~~~~~

  src/generated/types.gen.ts:304:17
    304                 notificationType: 'email' | 'sms' | 'webhook';
                        ~~~~~~~~~~~~~~~~
    'notificationType' is declared here.

src/features/search/components/SearchForm.tsx:78:7 - error TS2322: Type '"" | "every_1h" | "every_2h" | "every_6h" | "every_12h" | "every_24h"' is not assignable to type '"every_1h" | "every_2h" | "every_6h" | "every_12h" | "every_24h"'.
  Type '""' is not assignable to type '"every_1h" | "every_2h" | "every_6h" | "every_12h" | "every_24h"'.

78       frequency: existingSearch?.settings.frequency ?? "",
         ~~~~~~~~~

src/features/search/components/SearchForm.tsx:80:47 - error TS2551: Property 'notifications' does not exist on type '{ frequency: "every_1h" | "every_2h" | "every_6h" | "every_12h" | "every_24h"; listingsPerCheck: number; notificationType: "email" | "sms" | "webhook"; notificationTarget: string; }'. Did you mean 'notificationType'?

80       notifications: existingSearch?.settings.notifications ?? [],
                                                 ~~~~~~~~~~~~~

  src/generated/types.gen.ts:304:17
    304                 notificationType: 'email' | 'sms' | 'webhook';
                        ~~~~~~~~~~~~~~~~
    'notificationType' is declared here.

src/features/search/components/SearchForm.tsx:122:41 - error TS2551: Property 'notifications' does not exist on type '{ frequency: "every_1h" | "every_2h" | "every_6h" | "every_12h" | "every_24h"; listingsPerCheck: number; notificationType: "email" | "sms" | "webhook"; notificationTarget: string; }'. Did you mean 'notificationType'?

122     const current = settingsForm.values.notifications;
                                            ~~~~~~~~~~~~~

  src/generated/types.gen.ts:304:17
    304                 notificationType: 'email' | 'sms' | 'webhook';
                        ~~~~~~~~~~~~~~~~
    'notificationType' is declared here.

src/features/search/components/SearchForm.tsx:228:48 - error TS2551: Property 'notifications' does not exist on type '{ frequency: "every_1h" | "every_2h" | "every_6h" | "every_12h" | "every_24h"; listingsPerCheck: number; notificationType: "email" | "sms" | "webhook"; notificationTarget: string; }'. Did you mean 'notificationType'?

228                   checked={settingsForm.values.notifications.includes("email")}
                                                   ~~~~~~~~~~~~~

  src/generated/types.gen.ts:304:17
    304                 notificationType: 'email' | 'sms' | 'webhook';
                        ~~~~~~~~~~~~~~~~
    'notificationType' is declared here.

src/features/search/components/SearchForm.tsx:233:48 - error TS2551: Property 'notifications' does not exist on type '{ frequency: "every_1h" | "every_2h" | "every_6h" | "every_12h" | "every_24h"; listingsPerCheck: number; notificationType: "email" | "sms" | "webhook"; notificationTarget: string; }'. Did you mean 'notificationType'?

233                   checked={settingsForm.values.notifications.includes("sms")}
                                                   ~~~~~~~~~~~~~

  src/generated/types.gen.ts:304:17
    304                 notificationType: 'email' | 'sms' | 'webhook';
                        ~~~~~~~~~~~~~~~~
    'notificationType' is declared here.

src/features/search/components/SearchForm.tsx:238:48 - error TS2551: Property 'notifications' does not exist on type '{ frequency: "every_1h" | "every_2h" | "every_6h" | "every_12h" | "every_24h"; listingsPerCheck: number; notificationType: "email" | "sms" | "webhook"; notificat