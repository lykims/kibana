/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { createContext, useContext } from 'react';
import { ScopedHistory } from 'kibana/public';
import { ManagementAppMountParams } from 'src/plugins/management/public';
import { UsageCollectionSetup } from 'src/plugins/usage_collection/public';
import { CoreSetup, CoreStart } from '../../../../../src/core/public';

import { FleetSetup } from '../../../fleet/public';
import { IndexMgmtMetricsType } from '../types';
import { UiMetricService, NotificationService, HttpService } from './services';
import { ExtensionsService } from '../services';
import { SharePluginStart } from '../../../../../src/plugins/share/public';

const AppContext = createContext<AppDependencies | undefined>(undefined);

export interface AppDependencies {
  core: {
    fatalErrors: CoreStart['fatalErrors'];
    getUrlForApp: CoreStart['application']['getUrlForApp'];
  };
  plugins: {
    usageCollection: UsageCollectionSetup;
    fleet?: FleetSetup;
  };
  services: {
    uiMetricService: UiMetricService<IndexMgmtMetricsType>;
    extensionsService: ExtensionsService;
    httpService: HttpService;
    notificationService: NotificationService;
  };
  history: ScopedHistory;
  setBreadcrumbs: ManagementAppMountParams['setBreadcrumbs'];
  uiSettings: CoreSetup['uiSettings'];
  urlGenerators: SharePluginStart['urlGenerators'];
  docLinks: CoreStart['docLinks'];
}

export const AppContextProvider = ({
  children,
  value,
}: {
  value: AppDependencies;
  children: React.ReactNode;
}) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppContextConsumer = AppContext.Consumer;

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('"useAppContext" can only be called inside of AppContext.Provider!');
  }
  return ctx;
};

export const useServices = () => useAppContext().services;
