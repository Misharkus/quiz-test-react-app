#!/usr/bin/env python3
import re
import json

# Читаємо оригінальний файл
with open('/Users/mykhailo/quiz-test-react-app/src/api/questions.json', 'r', encoding='utf-8') as f:
    lines = f.readlines()

questions = []
i = 0
current_id = 0

while i < len(lines):
    line = lines[i].strip()
    
    # Шукаємо номер питання (формат: "123. Текст питання?")
    match = re.match(r'^(\d+)\.\s+(.+?)(?:\?|$)', line)
    
    if match:
        current_id = int(match.group(1))
        question_text = match.group(2).strip()
        
        # Читаємо опції (повинні бути на наступних рядках)
        options = []
        i += 1
        
        while i < len(lines):
            opt_line = lines[i].strip()
            
            # Перевіряємо чи це опція (формат: "1) текст опції")
            opt_match = re.match(r'^(\d+)\)\s+(.+)$', opt_line)
            
            if opt_match:
                opt_num = int(opt_match.group(1))
                opt_text = opt_match.group(2).strip()
                options.append(opt_text)
                i += 1
            elif opt_line and not re.match(r'^\d+\.\s+', opt_line):
                # Якщо це продовження опції (багаторядкова)
                if options:
                    options[-1] += ' ' + opt_line
                i += 1
            else:
                # Наступне питання
                break
        
        if len(options) > 0:
            question_obj = {
                "id": current_id,
                "question": question_text,
                "options": options,
                "correctAnswer": 0
            }
            questions.append(question_obj)
    else:
        i += 1

# Зберігаємо у JSON
output_file = '/Users/mykhailo/quiz-test-react-app/src/api/questions_converted.json'
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"✅ Конвертовано {len(questions)} питань")
print(f"📁 Збережено в: {output_file}")
