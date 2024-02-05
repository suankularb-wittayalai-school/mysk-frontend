export const YYYYMMDDRegex = /^\d{4}-(0[1-9]|1[1-2])-\d{2}$/;
export const YYYYWwwRegex = /^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])$/;
export const YYYYMMRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

export const schoolEmailRegex = /((@sk.ac.th)|(@student.sk.ac.th))$/;

export const classRegex = /^[1-6](0[1-9]|1[0-9])$/;
export const roomRegex = /^([1-6][1-5]|70)\d{2}(\/\d)?$/;

export const pantsSizeRegex = /^(1[3-9]|20)(x|×)(2[2-9]|3[0-9])|4[0-6]$/;

export const subjectCodeRegex = /^([\u0E00-\u0E7FA-Z]|[A-Z]{1,3})\\d{5}$/;
export const subjectCodeTHRegex = /^[\u0E00-\u0E7FA-Z]\\d{5}$/;
export const subjectCodeENRegex = /^[A-Z]{1,3}\\d{5}$/;

export const ggcCodeRegex = /^[a-zA-Z0-9]{6,7}$/;
export const ggcLinkRegex =
  /^https:\/\/classroom\.google\.com\/c\/[a-zA-Z0-9]{16}(\?cjc=[a-z0-9]{6,7})?/;
export const ggMeetLinkRegex =
  /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}(\?hs=\d{3})?/;

export const studentIDRegex = /^\d{5}$/;
export const citizenIDRegex = /^\d{13}$/;

export const mdTableRegex =
  /^(\|[^\n]+\|\r?\n)((?:\|:?[-]+:?)+\|)(\n(?:\|[^\n]+\|\r?\n?)*)?$/;
