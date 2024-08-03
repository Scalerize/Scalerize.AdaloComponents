
export const baseUrlDomain = 'https://1cfb-2a01-e0a-5f8-6f80-ac88-e632-c012-4617.ngrok-free.app/';
export const urls = {
    beacon: `${baseUrlDomain}automation/webhook/4c7eb7a3-89ae-4bdb-9afd-199e36b177c8`,
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
