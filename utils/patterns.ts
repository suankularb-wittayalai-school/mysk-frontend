export const schoolEmailPattern = "((@sk.ac.th)|(@student.sk.ac.th))$";
export const schoolEmailRegex = /((@sk.ac.th)|(@student.sk.ac.th))$/;

export const classPattern = "[1-6](0[1-9]|1[0-9])";
export const classRegex = /[1-6](0[1-9]|1[0-9])/;

export const roomPattern = "[1-6][1-5]\\d{2}";
export const roomRegex = /[1-6][1-5]\d{2}/;

export const subjectCodePattern = "([\u0E00-\u0E7FA-Z]|[A-Z]{1,3})\\d{5}";
export const subjectCodeTHPattern = "[\u0E00-\u0E7FA-Z]\\d{5}";
export const subjectCodeENPattern = "[A-Z]{1,3}\\d{5}";

export const studentIDPattern = "\\d{5}";
export const studentIDRegex = /\d{5}/;

export const citizenIDPattern = "\\d{13}";
export const citizenIDRegex = /\d{13}/;

export const mdTablePattern =
  "^(|[^\\n]+|\\r?\\n)((?:|:?[-]+:?)+|)(\\n(?:|[^\\n]+|\\r?\\n?)*)?$";
export const mdTableRegex =
  /^(\|[^\n]+\|\r?\n)((?:\|:?[-]+:?)+\|)(\n(?:\|[^\n]+\|\r?\n?)*)?$/;
