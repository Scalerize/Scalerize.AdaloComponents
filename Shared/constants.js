﻿export const urls = {
    beacon: 'https://www.scalerize.fr/automation/webhook/4c7eb7a3-89ae-4bdb-9afd-199e36b177c8',
    basePdfUrl: 'https://scalerize.fr/client-endpoints/scalerize/pdf/'
};
export const environments = {
    develop: 'develop',
    production: 'production',
}
export const environment = environments.production;

export const defaultApiHeaders = {
    Accept: 'application/pdf',
    'Content-Type': 'application/json'
};
