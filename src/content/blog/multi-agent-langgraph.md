---
title: 'Building a Multi-Agent Pipeline with LangGraph'
date: '2025-03-10'
tags: ['Agents', 'NLP', 'Python']
excerpt: 'How I structured a planner-executor agent system using LangGraph, with RAG for context injection and a feedback loop for self-correction.'
lang: 'en'
readTime: '6 min read'
reference: 'multi-agent-langgraph'
---

## Why multi-agent?

Single-agent systems hit a ceiling fast. When a task requires planning *and* execution *and* verification, one monolithic agent either gets confused or hallucinates steps. The solution: split responsibilities.

## The graph structure

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict

class AgentState(TypedDict):
    task: str
    plan: list[str]
    result: str
    iteration: int

graph = StateGraph(AgentState)
graph.add_node("planner", plan_step)
graph.add_node("executor", execute_step)
graph.add_node("verifier", verify_step)

graph.add_edge("planner", "executor")
graph.add_conditional_edges(
    "executor",
    should_continue,
    {"continue": "verifier", "done": END}
)
graph.add_edge("verifier", "planner")
```

## RAG for context

The planner node pulls relevant context via embeddings before generating a plan:

```python
def plan_step(state: AgentState) -> AgentState:
    context = retriever.invoke(state["task"])
    plan = llm.invoke(PLAN_PROMPT.format(
        task=state["task"],
        context=context
    ))
    return {**state, "plan": plan.steps}
```

## Results

After 3 iterations, the system reliably completes complex tasks that stumped single-agent approaches. The key insight: **separation of concerns is as important in agents as it is in software engineering**.
