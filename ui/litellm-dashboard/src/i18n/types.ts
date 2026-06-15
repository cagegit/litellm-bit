// Translation message structure - mirrors en.json and zh.json structure
type Messages = {
  common: {
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    search: string;
    filter: string;
    reset: string;
    confirm: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    yes: string;
    no: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    actions: string;
    status: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    total: string;
    count: string;
    enabled: string;
    disabled: string;
    active: string;
    inactive: string;
    all: string;
    none: string;
    other: string;
    language: string;
    switchLanguage: string;
    english: string;
    chinese: string;
    noData: string;
    confirmDelete: string;
    saveChanges: string;
    changesSaved: string;
    operationFailed: string;
    somethingWentWrong: string;
    pleaseTryAgain: string;
    required: string;
    optional: string;
  };
  layout: {
    title: string;
    description: string;
    loading: string;
    sidebar: {
      collapse: string;
      expand: string;
    };
  };
  navbar: {
    home: string;
    chat: string;
    playground: string;
    prompts: string;
    models: string;
    agents: string;
    logs: string;
    settings: string;
    documentation: string;
    blog: string;
    community: string;
    notifications: string;
    profile: string;
    logout: string;
    switchWorker: string;
    version: string;
  };
  users: {
    title: string;
    createUser: string;
    editUser: string;
    deleteUser: string;
    bulkCreate: string;
    bulkEdit: string;
    email: string;
    role: string;
    userRole: string;
    admin: string;
    user: string;
    viewUser: string;
    viewUsers: string;
    userDetails: string;
    userSettings: string;
    defaultUserSettings: string;
  };
  models: {
    title: string;
    addModel: string;
    editModel: string;
    deleteModel: string;
    modelHub: string;
    modelDetails: string;
    modelConfig: string;
    modelProvider: string;
    modelName: string;
    modelType: string;
    modelEndpoint: string;
    modelPrice: string;
    inputCost: string;
    outputCost: string;
    cacheCost: string;
  };
  logs: {
    title: string;
    viewLogs: string;
    logDetails: string;
    logEntry: string;
    logTime: string;
    logLevel: string;
    logMessage: string;
    logSource: string;
    logFilter: string;
    logSearch: string;
    logExport: string;
    logClear: string;
    logTimeRange: string;
    logLastHour: string;
    logLast24Hours: string;
    logLast7Days: string;
    logLast30Days: string;
  };
  settings: {
    title: string;
    general: string;
    security: string;
    notifications: string;
    integrations: string;
    cache: string;
    cacheSettings: string;
    cacheDashboard: string;
    cacheHealth: string;
    router: string;
    routerSettings: string;
    routingGroups: string;
    budgets: string;
    alerting: string;
    email: string;
    emailSettings: string;
    emailEvents: string;
    guardrails: string;
    guardrailsMonitor: string;
    guardrailsSettings: string;
    policies: string;
    toolPolicies: string;
    costTracking: string;
    costTrackingSettings: string;
  };
  organization: {
    title: string;
    organizationName: string;
    organizationSettings: string;
    teams: string;
    team: string;
    createTeam: string;
    editTeam: string;
    deleteTeam: string;
    teamMembers: string;
    teamPermissions: string;
    accessGroups: string;
    permissions: string;
    roles: string;
  };
  keys: {
    title: string;
    createKey: string;
    editKey: string;
    deleteKey: string;
    keyName: string;
    keyAlias: string;
    keyDetails: string;
    keyUsage: string;
    virtualKeys: string;
    keyPermissions: string;
    keyBudget: string;
    keyExpires: string;
    keyModels: string;
    keyModelsConfig: string;
  };
  billing: {
    title: string;
    usage: string;
    cost: string;
    totalCost: string;
    inputCost: string;
    outputCost: string;
    cacheCost: string;
    budget: string;
    budgetLimit: string;
    budgetSpent: string;
    budgetRemaining: string;
    billingHistory: string;
    invoice: string;
    payment: string;
    activityMetrics: string;
    entityUsageExport: string;
  };
  table: {
    show: string;
    entries: string;
    of: string;
    results: string;
    noResults: string;
    noResultsFound: string;
    search: string;
    filter: string;
    columns: string;
    sortAsc: string;
    sortDesc: string;
    pagination: {
      previous: string;
      next: string;
      jumpTo: string;
      jumpToConfirmation: string;
      page: string;
      of: string;
    };
  };
  form: {
    required: string;
    invalidEmail: string;
    invalidUrl: string;
    minLength: string;
    maxLength: string;
    selectOption: string;
    selectDate: string;
    enterValue: string;
  };
  chat: {
    title: string;
    sendMessage: string;
    typing: string;
    conversationHistory: string;
    newConversation: string;
    clearConversation: string;
    systemPrompt: string;
    temperature: string;
    maxTokens: string;
  };
  playground: {
    title: string;
    testModel: string;
    requestBody: string;
    responseBody: string;
    requestHeaders: string;
    responseHeaders: string;
    sendRequest: string;
    requestTime: string;
    requestSize: string;
    responseSize: string;
    status: string;
  };
  prompts: {
    title: string;
    createPrompt: string;
    editPrompt: string;
    deletePrompt: string;
    promptName: string;
    promptContent: string;
    promptTemplate: string;
    promptVersion: string;
  };
  agents: {
    title: string;
    createAgent: string;
    editAgent: string;
    deleteAgent: string;
    agentName: string;
    agentConfig: string;
    agentManagement: string;
    agentStatus: string;
    agentLogs: string;
    workflowRuns: string;
  };
  mcp: {
    title: string;
    mcpServers: string;
    mcpTools: string;
    serverManagement: string;
    toolDetail: string;
    searchTools: string;
  };
  tagManagement: {
    title: string;
    createTag: string;
    editTag: string;
    deleteTag: string;
    tagName: string;
    tagColor: string;
  };
  vectorStore: {
    title: string;
    vectorStoreManagement: string;
    createStore: string;
    editStore: string;
    deleteStore: string;
  };
  survey: {
    title: string;
    submitFeedback: string;
    rateExperience: string;
  };
  claudeCodePlugins: {
    title: string;
    pluginManagement: string;
  };
  deletedKeys: {
    title: string;
    deletedKeysPage: string;
    restoreKey: string;
    permanentDelete: string;
  };
  deletedTeams: {
    title: string;
    deletedTeamsPage: string;
    restoreTeam: string;
    permanentDelete: string;
  };
  memoryView: {
    title: string;
    memoryDetails: string;
  };
  aiHub: {
    title: string;
    hubOverview: string;
  };
  cloudZero: {
    title: string;
    costTracking: string;
  };
};

export type Locale = "en" | "zh";

export type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: <T extends string>(key: T, params?: Record<string, string | number>) => string;
  messages: Messages;
};

/**
 * Utility type for nested key paths.
 * Allows autocomplete for translation keys like "common.loading" or "layout.sidebar.collapse"
 */
export type NestedKeyOf<T, Prefix extends string = ""> = T extends string
  ? Prefix
  : {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], `${Prefix}${Prefix extends "" ? "" : "."}${K}`>
        : `${Prefix}${Prefix extends "" ? "" : "."}${K}`;
    }[keyof T & string];

export type TranslationKey = NestedKeyOf<Messages>;
