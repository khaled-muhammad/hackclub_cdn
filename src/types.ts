type FileItem = {
  mime_type: string;
  count: number;
  size: number;
};

type ResultItem = {
  text: string;
  progress: number;
};

export const summarizeStats = (files: FileItem[]): ResultItem[] => {
  const categoryMap: Record<string, { size: number }> = {
    Images: { size: 0 },
    Videos: { size: 0 },
    Others: { size: 0 },
  };

  for (const file of files) {
    const { mime_type, size } = file;
    if (mime_type.startsWith("image/")) {
      categoryMap.Images.size += size;
    } else if (mime_type.startsWith("video/")) {
      categoryMap.Videos.size += size;
    } else {
      categoryMap.Others.size += size;
    }
  }

  const totalSize = Object.values(categoryMap).reduce((sum, item) => sum + item.size, 0);

  const result: ResultItem[] = Object.entries(categoryMap)
    .filter(([_, { size }]) => size > 0)
    .map(([type, { size }]) => ({
      text: `${type} (${Math.round((size / totalSize) * 100)}% of the content)`,
      progress: Math.round((size / totalSize) * 100),
    }));

  return result;
}