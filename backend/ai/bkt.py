def calculate_mastery(correct_answers, total_questions):
    if total_questions == 0:
        return 0
    
    mastery = correct_answers / total_questions
    return round(mastery * 100, 2)