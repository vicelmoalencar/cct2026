#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
import sys

def clean_field(field):
    """Remove espaços e aspas extras"""
    if field is None:
        return ''
    return str(field).strip().strip('"').strip()

def parse_csv_with_semicolon(filename):
    """Parse CSV com ponto e vírgula como delimitador"""
    data = []
    with open(filename, 'r', encoding='utf-8', errors='ignore') as f:
        # Ler conteúdo e limpar
        content = f.read()
        lines = content.split('\n')
        
        if len(lines) < 2:
            return data
        
        # Pegar header e limpar
        header_line = lines[0] if lines[0].strip() else lines[1]
        headers = [h.strip() for h in header_line.split(';')]
        
        # Processar linhas de dados
        for line in lines[1:]:
            if not line.strip():
                continue
            
            values = line.split(';')
            row = {}
            for i, header in enumerate(headers):
                if i < len(values):
                    row[header] = clean_field(values[i])
                else:
                    row[header] = ''
            
            data.append(row)
    
    return data

def main():
    # Ler os arquivos
    print("📖 Lendo arquivos...")
    cursos = parse_csv_with_semicolon('cursos_original.csv')
    modulos = parse_csv_with_semicolon('modulos_original.csv')
    aulas = parse_csv_with_semicolon('aulas_original.csv')
    
    # Filtrar apenas cursos ativos
    cursos_ativos = [c for c in cursos if c.get('ativo', '').lower() == 'sim']
    print(f"✅ {len(cursos_ativos)} cursos ativos encontrados")
    
    # Criar o CSV de saída
    output_rows = []
    
    for curso in cursos_ativos:
        curso_id = curso.get('id_bubble_curso', '')
        curso_nome = curso.get('nome', 'Curso sem nome')
        curso_descricao = curso.get('breve_descricao', '')
        if not curso_descricao:
            curso_descricao = curso.get('descricao', '')[:200] if curso.get('descricao') else ''
        curso_instrutor = 'Vicelmo Alencar'
        curso_duracao = curso.get('carga_horaria', '10')
        
        # Adicionar linha do curso
        output_rows.append({
            'tipo': 'curso',
            'curso_titulo': curso_nome,
            'curso_descricao': curso_descricao,
            'curso_instrutor': curso_instrutor,
            'curso_duracao_horas': curso_duracao,
            'modulo_titulo': '',
            'modulo_descricao': '',
            'aula_titulo': '',
            'aula_descricao': '',
            'aula_video_provider': '',
            'aula_video_id': '',
            'aula_duracao_minutos': '',
            'aula_ordem': '',
            'aula_teste_gratis': ''
        })
        
        # Buscar módulos deste curso
        modulos_curso = [m for m in modulos if m.get('id_bubble_curso') == curso_id and m.get('ativo', '').lower() == 'sim']
        modulos_curso = sorted(modulos_curso, key=lambda x: float(x.get('ordenacao', 0)))
        
        for modulo in modulos_curso:
            modulo_id = modulo.get('id_bubble_modulo', '')
            modulo_nome = modulo.get('descricao', 'Módulo')
            
            # Adicionar linha do módulo
            output_rows.append({
                'tipo': 'modulo',
                'curso_titulo': '',
                'curso_descricao': '',
                'curso_instrutor': '',
                'curso_duracao_horas': '',
                'modulo_titulo': modulo_nome,
                'modulo_descricao': '',
                'aula_titulo': '',
                'aula_descricao': '',
                'aula_video_provider': '',
                'aula_video_id': '',
                'aula_duracao_minutos': '',
                'aula_ordem': '',
                'aula_teste_gratis': ''
            })
            
            # Buscar aulas deste módulo
            aulas_modulo = [a for a in aulas if a.get('id_bubble_modulo') == modulo_id and a.get('ativo', '').lower() == 'sim']
            aulas_modulo = sorted(aulas_modulo, key=lambda x: float(x.get('ordenacao', 0)) if x.get('ordenacao') else 999)
            
            for idx, aula in enumerate(aulas_modulo):
                aula_nome = aula.get('descricao', 'Aula')
                aula_video_fonte = aula.get('video_fonte', 'Vímeo').lower()
                if 'vimeo' in aula_video_fonte or 'vímeo' in aula_video_fonte:
                    aula_video_fonte = 'vimeo'
                elif 'youtube' in aula_video_fonte:
                    aula_video_fonte = 'youtube'
                else:
                    aula_video_fonte = 'url'
                
                aula_video_id = aula.get('video_id', '')
                aula_duracao = aula.get('minutos', '0')
                aula_teste_gratis = 'sim' if aula.get('teste_gratis', '').lower() == 'sim' else 'nao'
                
                # Adicionar linha da aula
                output_rows.append({
                    'tipo': 'aula',
                    'curso_titulo': '',
                    'curso_descricao': '',
                    'curso_instrutor': '',
                    'curso_duracao_horas': '',
                    'modulo_titulo': '',
                    'modulo_descricao': '',
                    'aula_titulo': aula_nome,
                    'aula_descricao': '',
                    'aula_video_provider': aula_video_fonte,
                    'aula_video_id': aula_video_id,
                    'aula_duracao_minutos': aula_duracao,
                    'aula_ordem': str(idx + 1),
                    'aula_teste_gratis': aula_teste_gratis
                })
    
    # Escrever o CSV de saída
    print(f"✍️  Escrevendo arquivo de importação...")
    with open('importacao_cct.csv', 'w', encoding='utf-8', newline='') as f:
        fieldnames = [
            'tipo',
            'curso_titulo',
            'curso_descricao',
            'curso_instrutor',
            'curso_duracao_horas',
            'modulo_titulo',
            'modulo_descricao',
            'aula_titulo',
            'aula_descricao',
            'aula_video_provider',
            'aula_video_id',
            'aula_duracao_minutos',
            'aula_ordem',
            'aula_teste_gratis'
        ]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(output_rows)
    
    # Estatísticas
    total_cursos = len([r for r in output_rows if r['tipo'] == 'curso'])
    total_modulos = len([r for r in output_rows if r['tipo'] == 'modulo'])
    total_aulas = len([r for r in output_rows if r['tipo'] == 'aula'])
    
    print(f"\n✅ Arquivo 'importacao_cct.csv' criado com sucesso!")
    print(f"📊 Estatísticas:")
    print(f"   - {total_cursos} cursos")
    print(f"   - {total_modulos} módulos")
    print(f"   - {total_aulas} aulas")
    print(f"   - Total de linhas: {len(output_rows) + 1} (incluindo cabeçalho)")

if __name__ == '__main__':
    main()
