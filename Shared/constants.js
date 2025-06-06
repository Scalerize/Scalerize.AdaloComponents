﻿
export const baseUrlDomain = 'https://www.scalerize.fr/';
export const urls = {
    beacon: `${baseUrlDomain}automation/webhook/a20f186e-38cc-4ce9-896f-22eaf7da5157`,
    basePdfUrl: `${baseUrlDomain}client-endpoints/scalerize/pdf/`
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

export const componentsIds = {
    slider: 1,
    invoiceGenerator: 2,
    certificateGenerator: 3,
};
