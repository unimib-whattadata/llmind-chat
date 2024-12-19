export type MessageType = {
  title: string | null;
  messageType:
    | "DIAGNOSIS"
    | "VALIDATION"
    | "SCORE"
    | "NOTE"
    | "CLINICAL"
    | "DEFAULT";
  id: number;
  text: string;
  timestamp: Date;
  role: "USER" | "AI";
  hasValidation: boolean;
  orderNumber: number | null;
  chatId: number | null;
  diagnosisBlock: number | null;
};

export type Block = {
  currentOperation: "VALIDATION" | "SCORE" | "NOTE" | "FINISHED";
  validation: "CORRECT" | "INCORRECT" | null;
  id: number;
  diagnosis: string;
  clinicalCase: string;
  score: string | null;
  note: string | null;
  blockMessages: MessageType[];
};
