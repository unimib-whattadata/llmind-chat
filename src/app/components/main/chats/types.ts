export type MessageType = {
  title: string | null;
  messageType:
    | "DIAGNOSIS"
    | "SCORE"
    | "MODEL-DIAGNOSIS"
    | "NOTE"
    | "CLINICAL"
    | "DEFAULT";
  id: number;
  text: string;
  timestamp: Date;
  role: "USER" | "AI";
  hasSkip: boolean;
  orderNumber: number | null;
  chatId: number | null;
  diagnosisBlock: number | null;
};

export type Block = {
  currentOperation: "SCORE" | "NOTE" | "FINISHED";
  id: number;
  title: string;
  section: string;
  diagnosis: string;
  clinicalCase: string;
  llmind_diagnosis: string;
  score: string | null;
  note: string | null;
  blockMessages: MessageType[];
};
