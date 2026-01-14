#!/usr/bin/env python3
"""
Test Report Generator for Add to Cart Test Suite
Generates comprehensive coverage report with pass/fail statistics
"""

import json
from datetime import datetime
from collections import defaultdict

def parse_test_results(json_file):
    """Parse Cucumber JSON results"""
    with open(json_file, 'r') as f:
        data = json.load(f)
    return data

def analyze_results(data):
    """Analyze test results and generate statistics"""
    stats = {
        'total_scenarios': 0,
        'passed_scenarios': 0,
        'failed_scenarios': 0,
        'total_steps': 0,
        'passed_steps': 0,
        'failed_steps': 0,
        'skipped_steps': 0,
        'scenarios': []
    }
    
    for feature in data:
        feature_name = feature.get('name', 'Unknown Feature')
        
        for element in feature.get('elements', []):
            if element.get('type') == 'scenario' or element.get('keyword') == 'Scenario':
                scenario_name = element.get('name', 'Unknown Scenario')
                scenario_line = element.get('line', 0)
                
                scenario_info = {
                    'feature': feature_name,
                    'name': scenario_name,
                    'line': scenario_line,
                    'status': 'passed',
                    'steps': [],
                    'failed_step': None,
                    'error_message': None
                }
                
                stats['total_scenarios'] += 1
                
                for step in element.get('steps', []):
                    # Skip hidden steps (hooks)
                    if step.get('hidden'):
                        continue
                    
                    step_keyword = step.get('keyword', '').strip()
                    step_name = step.get('name', '')
                    step_result = step.get('result', {})
                    step_status = step_result.get('status', 'unknown')
                    
                    stats['total_steps'] += 1
                    
                    step_info = {
                        'keyword': step_keyword,
                        'name': step_name,
                        'status': step_status,
                        'duration_ms': step_result.get('duration', 0) / 1000000
                    }
                    
                    scenario_info['steps'].append(step_info)
                    
                    if step_status == 'passed':
                        stats['passed_steps'] += 1
                    elif step_status == 'failed':
                        stats['failed_steps'] += 1
                        scenario_info['status'] = 'failed'
                        if not scenario_info['failed_step']:
                            scenario_info['failed_step'] = f"{step_keyword}{step_name}"
                            scenario_info['error_message'] = step_result.get('error_message', 'No error message')
                    elif step_status == 'skipped':
                        stats['skipped_steps'] += 1
                
                if scenario_info['status'] == 'passed':
                    stats['passed_scenarios'] += 1
                else:
                    stats['failed_scenarios'] += 1
                
                stats['scenarios'].append(scenario_info)
    
    return stats

def generate_html_report(stats, output_file):
    """Generate comprehensive HTML report"""
    
    pass_rate = (stats['passed_scenarios'] / stats['total_scenarios'] * 100) if stats['total_scenarios'] > 0 else 0
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add to Cart Test Coverage Report</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }}
        
        .container {{
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }}
        
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }}
        
        .header h1 {{
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }}
        
        .header .timestamp {{
            font-size: 1.1em;
            opacity: 0.9;
        }}
        
        .summary {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 40px;
            background: #f8f9fa;
        }}
        
        .summary-card {{
            background: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }}
        
        .summary-card:hover {{
            transform: translateY(-5px);
            box-shadow: 0 8px 12px rgba(0,0,0,0.15);
        }}
        
        .summary-card .number {{
            font-size: 3em;
            font-weight: bold;
            margin: 10px 0;
        }}
        
        .summary-card .label {{
            font-size: 1.1em;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }}
        
        .pass {{ color: #28a745; }}
        .fail {{ color: #dc3545; }}
        .skip {{ color: #ffc107; }}
        .total {{ color: #007bff; }}
        
        .pass-rate {{
            padding: 30px 40px;
            background: white;
            border-left: 5px solid {('#28a745' if pass_rate >= 80 else '#ffc107' if pass_rate >= 50 else '#dc3545')};
            margin: 0 40px 20px 40px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        
        .pass-rate h2 {{
            font-size: 1.8em;
            margin-bottom: 15px;
            color: #333;
        }}
        
        .progress-bar {{
            width: 100%;
            height: 40px;
            background: #e9ecef;
            border-radius: 20px;
            overflow: hidden;
            position: relative;
        }}
        
        .progress-fill {{
            height: 100%;
            background: linear-gradient(90deg, {('#28a745' if pass_rate >= 80 else '#ffc107' if pass_rate >= 50 else '#dc3545')}, {('#4CAF50' if pass_rate >= 80 else '#FFD54F' if pass_rate >= 50 else '#F44336')});
            width: {pass_rate}%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 1.2em;
            transition: width 1s ease;
        }}
        
        .scenarios-section {{
            padding: 40px;
        }}
        
        .scenarios-section h2 {{
            font-size: 2em;
            margin-bottom: 30px;
            color: #333;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }}
        
        .scenario-card {{
            background: white;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-left: 5px solid #ddd;
            transition: all 0.3s ease;
        }}
        
        .scenario-card:hover {{
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }}
        
        .scenario-card.passed {{
            border-left-color: #28a745;
            background: linear-gradient(to right, #f0fff4 0%, white 20%);
        }}
        
        .scenario-card.failed {{
            border-left-color: #dc3545;
            background: linear-gradient(to right, #fff5f5 0%, white 20%);
        }}
        
        .scenario-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }}
        
        .scenario-name {{
            font-size: 1.3em;
            font-weight: 600;
            color: #333;
            flex: 1;
        }}
        
        .scenario-status {{
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.9em;
            letter-spacing: 1px;
        }}
        
        .scenario-status.passed {{
            background: #28a745;
            color: white;
        }}
        
        .scenario-status.failed {{
            background: #dc3545;
            color: white;
        }}
        
        .scenario-meta {{
            font-size: 0.9em;
            color: #666;
            margin-bottom: 15px;
        }}
        
        .steps-list {{
            margin-top: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
        }}
        
        .step {{
            padding: 12px 15px;
            margin: 8px 0;
            background: white;
            border-radius: 6px;
            border-left: 3px solid #ddd;
            font-family: 'Courier New', monospace;
            font-size: 0.95em;
            display: flex;
            align-items: center;
            transition: all 0.2s ease;
        }}
        
        .step:hover {{
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        
        .step.passed {{
            border-left-color: #28a745;
        }}
        
        .step.failed {{
            border-left-color: #dc3545;
            background: #fff5f5;
        }}
        
        .step.skipped {{
            border-left-color: #ffc107;
            opacity: 0.6;
        }}
        
        .step-icon {{
            margin-right: 12px;
            font-size: 1.2em;
        }}
        
        .step-text {{
            flex: 1;
        }}
        
        .step-keyword {{
            font-weight: bold;
            margin-right: 8px;
            color: #667eea;
        }}
        
        .error-message {{
            margin-top: 15px;
            padding: 15px;
            background: #fff5f5;
            border-left: 4px solid #dc3545;
            border-radius: 6px;
            color: #721c24;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            white-space: pre-wrap;
            word-break: break-word;
        }}
        
        .error-message strong {{
            display: block;
            margin-bottom: 10px;
            color: #dc3545;
            font-size: 1.1em;
        }}
        
        .filter-buttons {{
            margin-bottom: 30px;
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }}
        
        .filter-btn {{
            padding: 12px 25px;
            border: 2px solid #667eea;
            background: white;
            color: #667eea;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1em;
            font-weight: 600;
            transition: all 0.3s ease;
        }}
        
        .filter-btn:hover {{
            background: #667eea;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
        }}
        
        .filter-btn.active {{
            background: #667eea;
            color: white;
        }}
        
        .footer {{
            background: #333;
            color: white;
            text-align: center;
            padding: 30px;
            font-size: 1em;
        }}
        
        @media print {{
            body {{
                background: white;
                padding: 0;
            }}
            .filter-buttons {{
                display: none;
            }}
            .scenario-card {{
                page-break-inside: avoid;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛒 Add to Cart Test Coverage Report</h1>
            <p class="timestamp">Generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
        </div>
        
        <div class="summary">
            <div class="summary-card">
                <div class="label">Total Scenarios</div>
                <div class="number total">{stats['total_scenarios']}</div>
            </div>
            <div class="summary-card">
                <div class="label">✓ Passed</div>
                <div class="number pass">{stats['passed_scenarios']}</div>
            </div>
            <div class="summary-card">
                <div class="label">✗ Failed</div>
                <div class="number fail">{stats['failed_scenarios']}</div>
            </div>
            <div class="summary-card">
                <div class="label">Total Steps</div>
                <div class="number total">{stats['total_steps']}</div>
            </div>
            <div class="summary-card">
                <div class="label">✓ Passed Steps</div>
                <div class="number pass">{stats['passed_steps']}</div>
            </div>
            <div class="summary-card">
                <div class="label">✗ Failed Steps</div>
                <div class="number fail">{stats['failed_steps']}</div>
            </div>
        </div>
        
        <div class="pass-rate">
            <h2>Pass Rate: {pass_rate:.1f}%</h2>
            <div class="progress-bar">
                <div class="progress-fill">{pass_rate:.1f}%</div>
            </div>
        </div>
        
        <div class="scenarios-section">
            <h2>Test Scenarios ({stats['total_scenarios']} Total)</h2>
            
            <div class="filter-buttons">
                <button class="filter-btn active" onclick="filterScenarios('all')">All Scenarios</button>
                <button class="filter-btn" onclick="filterScenarios('passed')">✓ Passed ({stats['passed_scenarios']})</button>
                <button class="filter-btn" onclick="filterScenarios('failed')">✗ Failed ({stats['failed_scenarios']})</button>
            </div>
            
            <div id="scenarios-container">
"""
    
    # Add each scenario
    for i, scenario in enumerate(stats['scenarios'], 1):
        status_class = scenario['status']
        status_icon = '✓' if scenario['status'] == 'passed' else '✗'
        
        html += f"""
                <div class="scenario-card {status_class}" data-status="{status_class}">
                    <div class="scenario-header">
                        <div class="scenario-name">{i}. {scenario['name']}</div>
                        <div class="scenario-status {status_class}">{status_icon} {status_class.upper()}</div>
                    </div>
                    <div class="scenario-meta">
                        <strong>Feature:</strong> {scenario['feature']} | 
                        <strong>Line:</strong> {scenario['line']} |
                        <strong>Steps:</strong> {len(scenario['steps'])}
                    </div>
"""
        
        if scenario['steps']:
            html += """
                    <div class="steps-list">
                        <strong style="display: block; margin-bottom: 15px; color: #333;">📋 Test Steps:</strong>
"""
            
            for step in scenario['steps']:
                step_icon = '✓' if step['status'] == 'passed' else '✗' if step['status'] == 'failed' else '⊘'
                html += f"""
                        <div class="step {step['status']}">
                            <span class="step-icon">{step_icon}</span>
                            <span class="step-text">
                                <span class="step-keyword">{step['keyword']}</span>
                                {step['name']}
                            </span>
                        </div>
"""
            
            html += """
                    </div>
"""
        
        if scenario['status'] == 'failed' and scenario['error_message']:
            # Truncate very long error messages
            error_msg = scenario['error_message']
            if len(error_msg) > 500:
                error_msg = error_msg[:500] + '...\n[Error message truncated]'
            
            html += f"""
                    <div class="error-message">
                        <strong>❌ Error Details:</strong>
                        {error_msg}
                    </div>
"""
        
        html += """
                </div>
"""
    
    html += """
            </div>
        </div>
        
        <div class="footer">
            <p>Vulcan Materials E-Commerce Test Automation Suite</p>
            <p>Add to Cart Feature - Comprehensive Test Coverage Report</p>
        </div>
    </div>
    
    <script>
        function filterScenarios(status) {
            const scenarios = document.querySelectorAll('.scenario-card');
            const buttons = document.querySelectorAll('.filter-btn');
            
            // Update active button
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            // Filter scenarios
            scenarios.forEach(scenario => {
                if (status === 'all' || scenario.dataset.status === status) {
                    scenario.style.display = 'block';
                } else {
                    scenario.style.display = 'none';
                }
            });
        }
        
        // Add smooth scroll to top button
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                if (!document.getElementById('scrollTop')) {
                    const btn = document.createElement('button');
                    btn.id = 'scrollTop';
                    btn.innerHTML = '↑';
                    btn.style.cssText = 'position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; border-radius: 50%; background: #667eea; color: white; border: none; font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 1000; transition: all 0.3s ease;';
                    btn.onmouseover = () => btn.style.transform = 'scale(1.1)';
                    btn.onmouseout = () => btn.style.transform = 'scale(1)';
                    btn.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
                    document.body.appendChild(btn);
                }
            } else {
                const btn = document.getElementById('scrollTop');
                if (btn) btn.remove();
            }
        });
    </script>
</body>
</html>
"""
    
    with open(output_file, 'w') as f:
        f.write(html)
    
    return output_file

def generate_markdown_report(stats, output_file):
    """Generate detailed markdown report"""
    
    pass_rate = (stats['passed_scenarios'] / stats['total_scenarios'] * 100) if stats['total_scenarios'] > 0 else 0
    
    md = f"""# Add to Cart - Comprehensive Test Coverage Report

**Generated:** {datetime.now().strftime('%B %d, %Y at %I:%M %p')}

---

## Executive Summary

### Overall Statistics

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Scenarios** | {stats['total_scenarios']} | 100% |
| **✓ Passed Scenarios** | {stats['passed_scenarios']} | {pass_rate:.1f}% |
| **✗ Failed Scenarios** | {stats['failed_scenarios']} | {100 - pass_rate:.1f}% |
| **Total Steps Executed** | {stats['total_steps']} | - |
| **✓ Passed Steps** | {stats['passed_steps']} | {(stats['passed_steps']/stats['total_steps']*100) if stats['total_steps'] > 0 else 0:.1f}% |
| **✗ Failed Steps** | {stats['failed_steps']} | {(stats['failed_steps']/stats['total_steps']*100) if stats['total_steps'] > 0 else 0:.1f}% |
| **⊘ Skipped Steps** | {stats['skipped_steps']} | {(stats['skipped_steps']/stats['total_steps']*100) if stats['total_steps'] > 0 else 0:.1f}% |

### Pass Rate: **{pass_rate:.1f}%**

```
{'█' * int(pass_rate/2)}{'░' * (50 - int(pass_rate/2))} {pass_rate:.1f}%
```

---

## Detailed Test Coverage

"""
    
    # Group by status
    passed = [s for s in stats['scenarios'] if s['status'] == 'passed']
    failed = [s for s in stats['scenarios'] if s['status'] == 'failed']
    
    # Passed scenarios
    if passed:
        md += f"\n### ✓ Passed Scenarios ({len(passed)})\n\n"
        for i, scenario in enumerate(passed, 1):
            md += f"{i}. **{scenario['name']}**\n"
            md += f"   - Feature: {scenario['feature']}\n"
            md += f"   - Steps: {len(scenario['steps'])}\n\n"
    
    # Failed scenarios
    if failed:
        md += f"\n### ✗ Failed Scenarios ({len(failed)})\n\n"
        for i, scenario in enumerate(failed, 1):
            md += f"{i}. **{scenario['name']}** ❌\n"
            md += f"   - Feature: {scenario['feature']}\n"
            md += f"   - Failed Step: `{scenario['failed_step']}`\n"
            if scenario['error_message']:
                error_preview = scenario['error_message'][:200] + '...' if len(scenario['error_message']) > 200 else scenario['error_message']
                md += f"   - Error: `{error_preview}`\n"
            md += f"   - Steps Executed: {len(scenario['steps'])}\n\n"
    
    # Complete step-by-step details
    md += "\n---\n\n## Complete Test Scenarios with Step-by-Step Details\n\n"
    
    for i, scenario in enumerate(stats['scenarios'], 1):
        status_icon = '✓' if scenario['status'] == 'passed' else '✗'
        md += f"\n### {i}. {scenario['name']} {status_icon}\n\n"
        md += f"**Status:** {scenario['status'].upper()}\n\n"
        md += f"**Feature:** {scenario['feature']}\n\n"
        md += f"**Line:** {scenario['line']}\n\n"
        
        if scenario['steps']:
            md += f"**Steps ({len(scenario['steps'])}):**\n\n"
            for j, step in enumerate(scenario['steps'], 1):
                step_icon = '✓' if step['status'] == 'passed' else '✗' if step['status'] == 'failed' else '⊘'
                md += f"{j}. {step_icon} **{step['keyword']}** {step['name']}\n"
                md += f"   - Status: `{step['status']}`\n"
                md += f"   - Duration: {step['duration_ms']:.2f}ms\n\n"
        
        if scenario['status'] == 'failed' and scenario['error_message']:
            md += f"\n**Error Details:**\n```\n{scenario['error_message'][:500]}\n```\n"
        
        md += "\n---\n"
    
    # Test coverage breakdown
    md += "\n## Test Coverage Breakdown\n\n"
    md += "### Features Tested:\n\n"
    features = {}
    for scenario in stats['scenarios']:
        feature = scenario['feature']
        if feature not in features:
            features[feature] = {'total': 0, 'passed': 0, 'failed': 0}
        features[feature]['total'] += 1
        if scenario['status'] == 'passed':
            features[feature]['passed'] += 1
        else:
            features[feature]['failed'] += 1
    
    for feature, counts in features.items():
        pass_rate_feature = (counts['passed'] / counts['total'] * 100) if counts['total'] > 0 else 0
        md += f"- **{feature}**\n"
        md += f"  - Total: {counts['total']}, Passed: {counts['passed']}, Failed: {counts['failed']}\n"
        md += f"  - Pass Rate: {pass_rate_feature:.1f}%\n\n"
    
    with open(output_file, 'w') as f:
        f.write(md)
    
    return output_file

def main():
    print("=" * 80)
    print("ADD TO CART TEST COVERAGE REPORT GENERATOR")
    print("=" * 80)
    print()
    
    json_file = 'test_results.json'
    html_output = 'ADD_TO_CART_TEST_REPORT.html'
    md_output = 'ADD_TO_CART_TEST_REPORT.md'
    
    print(f"📊 Parsing test results from: {json_file}")
    data = parse_test_results(json_file)
    
    print(f"📈 Analyzing test results...")
    stats = analyze_results(data)
    
    print(f"📝 Generating HTML report...")
    html_file = generate_html_report(stats, html_output)
    
    print(f"📝 Generating Markdown report...")
    md_file = generate_markdown_report(stats, md_output)
    
    print()
    print("=" * 80)
    print("REPORT GENERATION COMPLETE!")
    print("=" * 80)
    print()
    print(f"✓ HTML Report: {html_file}")
    print(f"✓ Markdown Report: {md_file}")
    print()
    print("=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print(f"Total Scenarios:    {stats['total_scenarios']}")
    print(f"✓ Passed:           {stats['passed_scenarios']}")
    print(f"✗ Failed:           {stats['failed_scenarios']}")
    print(f"Pass Rate:          {(stats['passed_scenarios']/stats['total_scenarios']*100) if stats['total_scenarios'] > 0 else 0:.1f}%")
    print()
    print(f"Total Steps:        {stats['total_steps']}")
    print(f"✓ Passed Steps:     {stats['passed_steps']}")
    print(f"✗ Failed Steps:     {stats['failed_steps']}")
    print(f"⊘ Skipped Steps:    {stats['skipped_steps']}")
    print("=" * 80)

if __name__ == '__main__':
    main()
