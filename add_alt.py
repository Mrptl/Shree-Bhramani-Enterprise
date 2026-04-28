import re

with open('Our_Printers.html', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    ('src="assets/printer1_gen.png"/>', 'src="assets/printer1_gen.png" alt="Bhramani Jet CIJ-100 Industrial Printer - High Speed Continuous Inkjet Coding Machine in Ahmedabad"/>'),
    ('src="assets/printer2_gen.png"/>', 'src="assets/printer2_gen.png" alt="Thermal Inkjet TIJ-200 Printer - Maintenance-Free High-Resolution 2D Coding Solution"/>'),
    ('src="assets/printer3_gen.png"/>', 'src="assets/printer3_gen.png" alt="Handheld Pro M3 Portable Industrial Printer - Battery-Operated Marking Machine"/>'),
    ('src="assets/printer4_gen.png"/>', 'src="assets/printer4_gen.png" alt="Fiber Laser L-40 Coding Machine - Permanent Laser Marking on Metals and Plastics"/>'),
    ('src="assets/printer5_gen.png"/>', 'src="assets/printer5_gen.png" alt="UV Curing Coder U-60 - Instant Drying UV Inkjet Printer for Non-Porous Materials"/>'),
    ('src="assets/printer6_gen.png"/>', 'src="assets/printer6_gen.png" alt="DOD Character D-50 Printer - Drop-On-Demand Large Character Inkjet for Cartons"/>'),
    ('src="assets/printer7_gen.png"/>', 'src="assets/printer7_gen.png" alt="Piezo High-Res P-70 Printer - Grayscale Piezoelectric Coding for Precise Labeling"/>'),
    ('src="assets/printer8_gen.png"/>', 'src="assets/printer8_gen.png" alt="CO2 Laser System C-80 - High-Speed Laser Marking for Paper and Cardboard Packaging"/>'),
    ('src="assets/printer9_gen.png"/>', 'src="assets/printer9_gen.png" alt="Conveyor Print Station - Fully Integrated Marking System for Automated Production"/>'),
    ('src="assets/printer10_gen.png"/>', 'src="assets/printer10_gen.png" alt="SmartFlow Hub W10 Control System - Advanced Centralized Hub for Print Heads"/>')
]

for old, new_tag in replacements:
    content = content.replace(old, new_tag)

with open('Our_Printers.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Alt text added successfully.')
