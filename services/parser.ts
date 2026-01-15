
import { VideoSubmission } from '../types';

export const parseSubmissionJson = (input: any): VideoSubmission[] => {
  // 将输入统一转换为数组处理
  const dataArray = Array.isArray(input) ? input : [input];
  const allSubmissions: VideoSubmission[] = [];

  dataArray.forEach((response, index) => {
    const list = response?.data?.list;
    if (!list || !Array.isArray(list)) {
      console.warn(`第 ${index + 1} 个数据块无效：未找到记录列表 (data.data.list)`);
      return;
    }

    const extracted = list.map((item: any) => {
      let name = item.recorder || "";
      let studentId = "";
      let videoUrl = "";

      // 深度搜索字段
      if (item.tpl_groups && Array.isArray(item.tpl_groups)) {
        for (const group of item.tpl_groups) {
          if (group.fields && Array.isArray(group.fields)) {
            for (const field of group.fields) {
              if (field.title === "姓名" && field.value) name = field.value;
              if (field.title === "学号" && field.value) studentId = field.value;
              if (field.type === "video" && Array.isArray(field.value) && field.value[0]?.url) {
                videoUrl = field.value[0].url;
              }
            }
          }
        }
      }

      // 备选学号解析
      if (!studentId && item.memory_maps?.tpl_memory_maps) {
        const maps = item.memory_maps.tpl_memory_maps;
        for (const key in maps) {
          if (typeof maps[key] === 'string' && /^\d{8,20}$/.test(maps[key])) {
            studentId = maps[key];
            break;
          }
        }
      }

      return {
        id: `${item.id}-${index}`, // 防止多批次合并时 ID 冲突
        studentName: name || "未知姓名",
        studentId: studentId || "无学号",
        videoUrl: videoUrl,
        originalFileName: videoUrl.split('/').pop()?.split('?')[0] || "video.mp4",
        status: 'pending' as const
      };
    }).filter(item => item.videoUrl);

    allSubmissions.push(...extracted);
  });

  return allSubmissions;
};
