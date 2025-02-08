export const getDistributorMongoUrl = (identifier: string): string => {
  const key = `${identifier}_URL`;
  const url = process.env[key];
  if (!url) {
    throw new Error(`Missing distributor endpoint url for ${identifier}`);
  }

  return url;
};
