// 列表
export interface ITestlist {
  page?: number;
  psize?: number;
  key?: string;
  admin?: string;
  [propName: string]: any;
}
export interface IStudentTest extends ITestlist {
  depid: number | string;
  classid: number | string;
}
// 删除试题
export interface ITestDel {
  id: number;
}
// 批量删除试题
export interface ITestDelall {
  ids: Array<number>;
}
// 发布状态
export interface ITestState {
  state: number;
  ids: Array<number>;
}
// 考试题目
export interface ITestTopic {
  id: number;
}
// 考试试题弹框
export interface ITestTopicList {
  id: number;
  title: string;
  info: string;
  addtime: string;
  teacherid: number;
  admin?: any;
  begintime: string;
  endtime: string;
  currenttime: string;
  studentStartTime: string;
  limittime: number;
  qorder: number;
  aorder: number;
  num: number;
  pastnum: number;
  scores: number;
  pastscores: number;
  subjectnum: number;
  isshow: number;
  answershow: number;
  studentcounts: number;
  incomplete: number;
  limits?: any;
  markteachers?: any;
  students?: any;
  databaseid: number;
  state: number;
  result?: any;
  studentIsComplete: number;
  questions: Question[];
}

interface Question {
  id: number;
  testid: number;
  title: string;
  type: string;
  scores: number;
  answer: string;
  tags: string;
  explains: string;
  answers: Answer[];
  answerid: number;
  comments?: any;
  studentanswer?: any;
  studentscores?: any;
}

interface Answer {
  id: number;
  answerno: string;
  questionid: number;
  content: string;
}
// 考试学生添加
export interface IStudentAdd {
  testid: number;
  list: List[];
}

interface List {
  studentid: number;
  testid: number;
}
interface IVisibleTeacher {
  testid: number;
  list: List1[];
}

interface List1 {
  id: number;
}
export interface IAnalyse {
  testid: number;
}

export interface ITestAnswer {
  testid: number;
  studentid?: number;
}
interface IAnswer {
  answerid: number;
  scores: number;
  comments: string;
}
export interface IExportExcel {
  id: number;
}
interface IQuestion {
  id: number;
  title: string;
  isshow: number;
  limits: Limit[];
}

interface Limit {
  id: number;
}
