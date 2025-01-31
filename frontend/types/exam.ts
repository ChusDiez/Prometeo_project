export interface Question {
    id: string;
    exam_id: string;
    text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    correct_option: 'A' | 'B' | 'C';
    topic: string;
    feedback?: string;
  }
  
  export interface Exam {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    user_id: string;
    zoom_url?: string;
  }
  
  export interface Result {
    id: string;
    user_id: string;
    exam_id: string;
    final_score: number;
    created_at: string;
  }
  
  export interface AnswerPayload {
    question_id: string;
    selected_option: 'A' | 'B' | 'C';
  }