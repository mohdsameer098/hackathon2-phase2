# Todo App - Phase I Overview

## Project Name
Phase I: In-Memory Python Console Todo App

## Purpose
Build a command-line todo application that demonstrates Spec-Driven Development principles using Claude Code.

## Current Phase
**Phase I** - Console Application (Due: Dec 7, 2025)

## Tech Stack
- **Language**: Python 3.14
- **Storage**: In-memory (Python list/dict)
- **Interface**: Command-line (CLI)
- **Development**: Claude Code + Spec-Driven approach

## Core Features (Basic Level)
1. ✅ Add Task - Create new todo items
2. ✅ Delete Task - Remove tasks from list
3. ✅ Update Task - Modify existing task details
4. ✅ View Task List - Display all tasks
5. ✅ Mark as Complete - Toggle task completion status

## Success Criteria
- All 5 basic features fully functional
- Clean, well-structured Python code
- Proper error handling
- User-friendly console interface
- Generated via Claude Code (no manual coding)

## Constraints
- No external libraries (pure Python)
- No database (in-memory storage only)
- Must use Spec-Driven Development workflow
- All code generated via Claude Code

## Project Structure
```
phase1-console/
├── CONSTITUTION.md       # Project principles
├── CLAUDE.md            # Claude Code instructions
├── specs/               # Specifications
│   ├── overview.md      # This file
│   ├── features/        # Feature specifications
│   ├── plan.md          # Architecture plan
│   └── tasks.md         # Task breakdown
├── src/                 # Source code
│   ├── main.py          # Entry point
│   ├── models.py        # Task model
│   ├── storage.py       # In-memory storage
│   └── ui.py            # Console interface
└── README.md            # Setup instructions
```

## Development Workflow
1. **SPECIFY** → Write feature requirements
2. **PLAN** → Design architecture
3. **TASKS** → Break down into small tasks
4. **IMPLEMENT** → Generate code via Claude Code