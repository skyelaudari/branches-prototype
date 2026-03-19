import React, { useState, useCallback, useMemo, useRef } from 'react';

// Utility functions
const generateId = () => Math.random().toString(36).substring(2, 11);

const createDemoProject = () => ({
  id: generateId(),
  name: 'Crib Equity — Series A Strategy',
  description: 'Complete Series A fundraising initiative',
  createdAt: new Date('2026-01-15'),
  branches: [
    {
      id: 'root',
      name: 'Series A Planning',
      description: 'Root branch for Series A strategy',
      status: 'active',
      parentId: null,
      children: ['investor-research', 'pitch-materials', 'legal-prep'],
      inheritedContext: [],
      localContext: [
        {
          id: generateId(),
          type: 'insight',
          content: 'Fundraising goal: $5M Series A',
          source: 'Series A Planning',
          propagation: 'downstream',
          createdAt: new Date('2026-01-15'),
        },
        {
          id: generateId(),
          type: 'decision',
          content: 'Target timeline: Q2 2026 closing',
          source: 'Series A Planning',
          propagation: 'downstream',
          createdAt: new Date('2026-01-16'),
        },
        {
          id: generateId(),
          type: 'note',
          content: 'Company focus: PropTech with AI-driven underwriting',
          source: 'Series A Planning',
          propagation: 'downstream',
          createdAt: new Date('2026-01-17'),
        },
      ],
      promotedContext: [],
      conversations: [
        {
          id: generateId(),
          title: 'Strategic Planning Discussion',
          messages: [
            {
              id: generateId(),
              role: 'user',
              content: 'What are our key differentiators for Series A investors?',
              timestamp: new Date('2026-01-15T10:00:00'),
            },
            {
              id: generateId(),
              role: 'assistant',
              content: 'Our proprietary AI model achieves 40% lower default rates than competitors. We also have strong unit economics with a 3.2x CAC payback period in 18 months.',
              timestamp: new Date('2026-01-15T10:15:00'),
            },
          ],
          createdAt: new Date('2026-01-15T10:00:00'),
        },
      ],
      artifacts: [
        {
          id: generateId(),
          name: 'Series A Memo Draft',
          type: 'document',
          content: 'Executive overview of company, market opportunity, and growth projections...',
          createdAt: new Date('2026-01-16'),
        },
      ],
      tasks: [
        {
          id: generateId(),
          title: 'Define target investors',
          status: 'in-progress',
          assignedBranch: 'investor-research',
        },
        {
          id: generateId(),
          title: 'Finalize pitch deck',
          status: 'todo',
          assignedBranch: 'pitch-materials',
        },
      ],
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-02-28'),
    },
    {
      id: 'investor-research',
      name: 'Investor Research',
      description: 'Deep dive into investor landscape and targeting',
      status: 'active',
      parentId: 'root',
      children: [],
      inheritedContext: [
        {
          id: generateId(),
          type: 'insight',
          content: 'Fundraising goal: $5M Series A',
          source: 'Series A Planning',
          propagation: 'downstream',
          createdAt: new Date('2026-01-15'),
        },
        {
          id: generateId(),
          type: 'decision',
          content: 'Target timeline: Q2 2026 closing',
          source: 'Series A Planning',
          propagation: 'downstream',
          createdAt: new Date('2026-01-16'),
        },
      ],
      localContext: [
        {
          id: generateId(),
          type: 'insight',
          content: 'Early-stage VCs prefer Series A rounds in $4-7M range',
          source: 'Investor Research',
          propagation: 'both',
          createdAt: new Date('2026-01-20'),
        },
      ],
      promotedContext: [
        {
          id: generateId(),
          type: 'insight',
          content: 'Top 5 investor shortlist identified: Sequoia, Lightspeed, Bessemer, Accel, First Round',
          source: 'Investor Research',
          propagation: 'upstream',
          createdAt: new Date('2026-01-25'),
        },
      ],
      conversations: [
        {
          id: generateId(),
          title: 'Investor Landscape Analysis',
          messages: [
            {
              id: generateId(),
              role: 'user',
              content: 'Which VCs have the strongest PropTech track record?',
              timestamp: new Date('2026-01-20T14:00:00'),
            },
            {
              id: generateId(),
              role: 'assistant',
              content: 'Lightspeed and Sequoia have led 15+ PropTech Series A rounds. Both have deep real estate networks and operator relationships.',
              timestamp: new Date('2026-01-20T14:20:00'),
            },
          ],
          createdAt: new Date('2026-01-20T14:00:00'),
        },
      ],
      artifacts: [
        {
          id: generateId(),
          name: 'Target Investor List',
          type: 'document',
          content: 'Comprehensive list of 50+ potential Series A investors with contact info and fund details...',
          createdAt: new Date('2026-01-22'),
        },
        {
          id: generateId(),
          name: 'Competitive Landscape',
          type: 'document',
          content: 'Analysis of 8 direct competitors, their funding rounds, and market positioning...',
          createdAt: new Date('2026-01-23'),
        },
      ],
      tasks: [
        {
          id: generateId(),
          title: 'Research PropTech VCs',
          status: 'done',
        },
        {
          id: generateId(),
          title: 'Identify angel investors',
          status: 'in-progress',
        },
        {
          id: generateId(),
          title: 'Build outreach sequence',
          status: 'todo',
        },
      ],
      createdAt: new Date('2026-01-18'),
      updatedAt: new Date('2026-02-27'),
    },
    {
      id: 'pitch-materials',
      name: 'Pitch Materials',
      description: 'Development of pitch deck and presentation materials',
      status: 'active',
      parentId: 'root',
      children: ['financial-modeling'],
      inheritedContext: [
        {
          id: generateId(),
          type: 'insight',
          content: 'Fundraising goal: $5M Series A',
          source: 'Series A Planning',
          propagation: 'downstream',
          createdAt: new Date('2026-01-15'),
        },
      ],
      localContext: [
        {
          id: generateId(),
          type: 'decision',
          content: 'Pitch narrative: Problem → Solution → Market → Product → Team → Ask',
          source: 'Pitch Materials',
          propagation: 'downstream',
          createdAt: new Date('2026-01-21'),
        },
      ],
      promotedContext: [],
      conversations: [
        {
          id: generateId(),
          title: 'Pitch Deck Strategy',
          messages: [
            {
              id: generateId(),
              role: 'user',
              content: 'How should we structure the opening slide to capture attention?',
              timestamp: new Date('2026-01-21T11:00:00'),
            },
            {
              id: generateId(),
              role: 'assistant',
              content: 'Lead with the problem: Mortgage fraud costs lenders $2B annually. Then position our AI solution as the antidote.',
              timestamp: new Date('2026-01-21T11:25:00'),
            },
          ],
          createdAt: new Date('2026-01-21T11:00:00'),
        },
      ],
      artifacts: [
        {
          id: generateId(),
          name: 'Pitch Deck v1',
          type: 'document',
          content: 'Complete pitch deck with 15 slides covering problem, solution, market, and financials...',
          createdAt: new Date('2026-01-24'),
        },
      ],
      tasks: [
        {
          id: generateId(),
          title: 'Design slide template',
          status: 'done',
        },
        {
          id: generateId(),
          title: 'Write problem statement',
          status: 'done',
        },
      ],
      createdAt: new Date('2026-01-19'),
      updatedAt: new Date('2026-02-26'),
    },
    {
      id: 'financial-modeling',
      name: 'Financial Modeling',
      description: 'Revenue projections and financial analysis',
      status: 'active',
      parentId: 'pitch-materials',
      children: [],
      inheritedContext: [
        {
          id: generateId(),
          type: 'insight',
          content: 'Fundraising goal: $5M Series A',
          source: 'Series A Planning',
          propagation: 'downstream',
          createdAt: new Date('2026-01-15'),
        },
        {
          id: generateId(),
          type: 'decision',
          content: 'Pitch narrative: Problem → Solution → Market → Product → Team → Ask',
          source: 'Pitch Materials',
          propagation: 'downstream',
          createdAt: new Date('2026-01-21'),
        },
      ],
      localContext: [
        {
          id: generateId(),
          type: 'insight',
          content: '5-year projection shows $50M ARR by year 3',
          source: 'Financial Modeling',
          propagation: 'upstream',
          createdAt: new Date('2026-01-28'),
        },
      ],
      promotedContext: [
        {
          id: generateId(),
          type: 'insight',
          content: 'Key metrics: CAC $1,200, LTV $5,000, Payback 18 months',
          source: 'Financial Modeling',
          propagation: 'upstream',
          createdAt: new Date('2026-02-02'),
        },
      ],
      conversations: [
        {
          id: generateId(),
          title: 'Revenue Model Discussion',
          messages: [
            {
              id: generateId(),
              role: 'user',
              content: 'Should we use per-transaction or per-loan pricing?',
              timestamp: new Date('2026-01-28T09:30:00'),
            },
            {
              id: generateId(),
              role: 'assistant',
              content: 'Per-transaction aligns incentives better. At $250 per transaction, with projected 20K annual transactions, you hit $5M ARR by year 3.',
              timestamp: new Date('2026-01-28T10:00:00'),
            },
          ],
          createdAt: new Date('2026-01-28T09:30:00'),
        },
      ],
      artifacts: [
        {
          id: generateId(),
          name: '5-Year Projection Model',
          type: 'document',
          content: 'Excel model with revenue projections, unit economics, and break-even analysis...',
          createdAt: new Date('2026-01-30'),
        },
      ],
      tasks: [
        {
          id: generateId(),
          title: 'Validate assumptions',
          status: 'in-progress',
        },
        {
          id: generateId(),
          title: 'Sensitivity analysis',
          status: 'todo',
        },
      ],
      createdAt: new Date('2026-01-27'),
      updatedAt: new Date('2026-02-25'),
    },
    {
      id: 'legal-prep',
      name: 'Legal Prep',
      description: 'Legal documentation and compliance',
      status: 'paused',
      parentId: 'root',
      children: [],
      inheritedContext: [
        {
          id: generateId(),
          type: 'insight',
          content: 'Fundraising goal: $5M Series A',
          source: 'Series A Planning',
          propagation: 'downstream',
          createdAt: new Date('2026-01-15'),
        },
      ],
      localContext: [],
      promotedContext: [],
      conversations: [
        {
          id: generateId(),
          title: 'Legal Requirements',
          messages: [
            {
              id: generateId(),
              role: 'user',
              content: 'What documents do we need for Series A?',
              timestamp: new Date('2026-01-17T15:00:00'),
            },
            {
              id: generateId(),
              role: 'assistant',
              content: 'Standard docs: SAFE agreement, investment agreement, cap table, 83(b) elections, and disclosure schedules.',
              timestamp: new Date('2026-01-17T15:30:00'),
            },
          ],
          createdAt: new Date('2026-01-17T15:00:00'),
        },
      ],
      artifacts: [
        {
          id: generateId(),
          name: 'Term Sheet Template',
          type: 'document',
          content: 'Standard Series A term sheet with investment amount, valuation, and preferences...',
          createdAt: new Date('2026-01-19'),
        },
      ],
      tasks: [
        {
          id: generateId(),
          title: 'Review incorporation docs',
          status: 'todo',
        },
        {
          id: generateId(),
          title: 'Draft SAFE agreement',
          status: 'todo',
        },
      ],
      createdAt: new Date('2026-01-17'),
      updatedAt: new Date('2026-02-20'),
    },
  ],
});

// Main Component
export default function ClaudeProjects() {
  const [project, setProject] = useState(createDemoProject());
  const [selectedBranchId, setSelectedBranchId] = useState('root');
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('conversations');
  const [expandedBranches, setExpandedBranches] = useState(new Set(['root', 'pitch-materials']));
  const [contextFilter, setContextFilter] = useState('all');
  const [chatInput, setChatInput] = useState('');

  const selectedBranch = useMemo(() => {
    return project.branches.find((b) => b.id === selectedBranchId);
  }, [project, selectedBranchId]);

  const getBranchLineage = useCallback((branchId) => {
    const lineage = [];
    let currentId = branchId;
    while (currentId) {
      const branch = project.branches.find((b) => b.id === currentId);
      if (branch) {
        lineage.unshift(branch);
        currentId = branch.parentId;
      } else {
        break;
      }
    }
    return lineage;
  }, [project]);

  const getChildBranches = useCallback((parentId) => {
    return project.branches.filter((b) => b.parentId === parentId);
  }, [project]);

  const handleCreateBranch = useCallback((parentId, name, description) => {
    const newBranch = {
      id: generateId(),
      name,
      description,
      status: 'active',
      parentId,
      children: [],
      inheritedContext: [],
      localContext: [],
      promotedContext: [],
      conversations: [],
      artifacts: [],
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const parent = project.branches.find((b) => b.id === parentId);
    if (parent && !parent.children.includes(newBranch.id)) {
      parent.children.push(newBranch.id);
    }

    // Inherit context from parent
    if (parent) {
      newBranch.inheritedContext = [
        ...parent.localContext.filter((c) => c.propagation === 'downstream' || c.propagation === 'both'),
        ...parent.inheritedContext,
      ];
    }

    setProject({
      ...project,
      branches: [...project.branches, newBranch],
    });

    setSelectedBranchId(newBranch.id);
    setExpandedBranches((prev) => new Set([...prev, parentId]));
  }, [project]);

  const handleUpdateBranchStatus = useCallback((branchId, newStatus) => {
    setProject({
      ...project,
      branches: project.branches.map((b) =>
        b.id === branchId ? { ...b, status: newStatus, updatedAt: new Date() } : b
      ),
    });
  }, [project]);

  const handleAddConversation = useCallback((branchId) => {
    setProject({
      ...project,
      branches: project.branches.map((b) => {
        if (b.id === branchId) {
          return {
            ...b,
            conversations: [
              ...b.conversations,
              {
                id: generateId(),
                title: 'New Conversation',
                messages: [],
                createdAt: new Date(),
              },
            ],
          };
        }
        return b;
      }),
    });
  }, [project]);

  const handleAddMessage = useCallback((branchId, conversationId, content) => {
    setProject({
      ...project,
      branches: project.branches.map((b) => {
        if (b.id === branchId) {
          return {
            ...b,
            conversations: b.conversations.map((c) => {
              if (c.id === conversationId) {
                const userMessage = {
                  id: generateId(),
                  role: 'user',
                  content,
                  timestamp: new Date(),
                };
                const assistantMessage = {
                  id: generateId(),
                  role: 'assistant',
                  content: `This is a simulated response. In a real implementation, this would be an actual Claude API response addressing: "${content}"`,
                  timestamp: new Date(Date.now() + 1000),
                };
                return {
                  ...c,
                  messages: [...c.messages, userMessage, assistantMessage],
                };
              }
              return c;
            }),
          };
        }
        return b;
      }),
    });
  }, [project]);

  const handleAddArtifact = useCallback((branchId, name, type) => {
    setProject({
      ...project,
      branches: project.branches.map((b) => {
        if (b.id === branchId) {
          return {
            ...b,
            artifacts: [
              ...b.artifacts,
              {
                id: generateId(),
                name,
                type,
                content: 'New artifact content...',
                createdAt: new Date(),
              },
            ],
          };
        }
        return b;
      }),
    });
  }, [project]);

  const handleAddTask = useCallback((branchId, title, assignedBranch) => {
    setProject({
      ...project,
      branches: project.branches.map((b) => {
        if (b.id === branchId) {
          return {
            ...b,
            tasks: [
              ...b.tasks,
              {
                id: generateId(),
                title,
                status: 'todo',
                assignedBranch,
              },
            ],
          };
        }
        return b;
      }),
    });
  }, [project]);

  const handleMoveTask = useCallback((branchId, taskId, newStatus) => {
    setProject({
      ...project,
      branches: project.branches.map((b) => {
        if (b.id === branchId) {
          return {
            ...b,
            tasks: b.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
          };
        }
        return b;
      }),
    });
  }, [project]);

  const handlePromoteContext = useCallback((branchId, contextId, fromChildId) => {
    setProject({
      ...project,
      branches: project.branches.map((b) => {
        if (b.id === branchId) {
          const childBranch = project.branches.find((cb) => cb.id === fromChildId);
          if (childBranch) {
            const contextItem = childBranch.promotedContext.find((c) => c.id === contextId);
            if (contextItem) {
              return {
                ...b,
                promotedContext: [...b.promotedContext, contextItem],
              };
            }
          }
        }
        return b;
      }),
    });
  }, [project]);

  const handleToggleContextPropagation = useCallback((branchId, contextId, newPropagation) => {
    setProject({
      ...project,
      branches: project.branches.map((b) => {
        if (b.id === branchId) {
          const updateContext = (contextList) =>
            contextList.map((c) => (c.id === contextId ? { ...c, propagation: newPropagation } : c));

          return {
            ...b,
            localContext: updateContext(b.localContext),
            inheritedContext: updateContext(b.inheritedContext),
          };
        }
        return b;
      }),
    });
  }, [project]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50">
      {/* Left Sidebar - Branch Tree */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h1 className="text-lg font-bold mb-4 text-white">{project.name}</h1>
          <button
            onClick={() => {
              const name = prompt('New branch name:');
              if (name) handleCreateBranch('root', name, '');
            }}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold py-2 px-3 rounded-lg transition mb-2"
          >
            + New Branch
          </button>
          <button
            onClick={() => {
              const name = prompt('Fork as sibling. New name:');
              if (name && selectedBranch) {
                handleCreateBranch(selectedBranch.parentId || 'root', name, selectedBranch.description);
              }
            }}
            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-50 py-2 px-3 rounded-lg transition text-sm"
          >
            ⎇ Fork Branch
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <BranchTree
            project={project}
            selectedBranchId={selectedBranchId}
            onSelectBranch={setSelectedBranchId}
            expandedBranches={expandedBranches}
            onToggleExpanded={(id) => {
              setExpandedBranches((prev) => {
                const next = new Set(prev);
                if (next.has(id)) {
                  next.delete(id);
                } else {
                  next.add(id);
                }
                return next;
              });
            }}
            onCreateChild={(parentId) => {
              const name = prompt('New child branch name:');
              if (name) handleCreateBranch(parentId, name, '');
            }}
          />
        </div>
      </div>

      {/* Center Panel - Branch Detail */}
      <div className="flex-1 flex flex-col bg-slate-950 border-r border-slate-800 overflow-hidden">
        {selectedBranch ? (
          <>
            {/* Branch Header */}
            <div className="border-b border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedBranch.name}</h2>
                  <p className="text-slate-400 text-sm mb-2">{selectedBranch.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Lineage:</span>
                    {getBranchLineage(selectedBranch.id).map((b, idx) => (
                      <span key={b.id}>
                        <button
                          onClick={() => setSelectedBranchId(b.id)}
                          className="hover:text-amber-400 transition"
                        >
                          {b.name}
                        </button>
                        {idx < getBranchLineage(selectedBranch.id).length - 1 && <span className="mx-1">›</span>}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <select
                    value={selectedBranch.status}
                    onChange={(e) => handleUpdateBranchStatus(selectedBranch.id, e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-slate-50 px-3 py-1 rounded text-sm"
                  >
                    <option value="active">● Active</option>
                    <option value="paused">● Paused</option>
                    <option value="completed">● Completed</option>
                    <option value="archived">● Archived</option>
                  </select>
                  <button
                    onClick={() => {
                      const name = prompt('Child branch name:');
                      if (name) handleCreateBranch(selectedBranch.id, name, '');
                    }}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-50 py-1 px-3 rounded text-sm transition"
                  >
                    + Child
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 pt-4 border-b border-slate-800 bg-slate-900">
              {['conversations', 'artifacts', 'tasks'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium transition border-b-2 ${
                    activeTab === tab
                      ? 'border-amber-500 text-amber-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'conversations' && (
                <ConversationsTab
                  branch={selectedBranch}
                  onAddConversation={() => handleAddConversation(selectedBranch.id)}
                  onAddMessage={(convId, content) => handleAddMessage(selectedBranch.id, convId, content)}
                />
              )}
              {activeTab === 'artifacts' && (
                <ArtifactsTab
                  branch={selectedBranch}
                  onAddArtifact={(name, type) => handleAddArtifact(selectedBranch.id, name, type)}
                />
              )}
              {activeTab === 'tasks' && (
                <TasksTab
                  branch={selectedBranch}
                  allBranches={project.branches}
                  onAddTask={(title, assignedBranch) => handleAddTask(selectedBranch.id, title, assignedBranch)}
                  onMoveTask={(taskId, newStatus) => handleMoveTask(selectedBranch.id, taskId, newStatus)}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            <p>Select a branch to view details</p>
          </div>
        )}
      </div>

      {/* Right Sidebar - Context Panel */}
      {rightPanelOpen && (
        <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <h3 className="font-bold text-white">Context Flow</h3>
            <button
              onClick={() => setRightPanelOpen(false)}
              className="text-slate-400 hover:text-slate-200 transition"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {selectedBranch && (
              <>
                {/* Upstream Context */}
                {selectedBranch.inheritedContext.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                      <span>↓</span> Inherited from Parent
                    </h4>
                    <div className="space-y-2">
                      {selectedBranch.inheritedContext.map((context) => (
                        <ContextItem
                          key={context.id}
                          context={context}
                          onTogglePropagation={(newProp) =>
                            handleToggleContextPropagation(selectedBranch.id, context.id, newProp)
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Local Context */}
                {selectedBranch.localContext.length > 0 && (
                  <div className="space-y-3 border-t border-slate-800 pt-4">
                    <h4 className="text-sm font-semibold text-slate-300">Local Context</h4>
                    <div className="space-y-2">
                      {selectedBranch.localContext.map((context) => (
                        <ContextItem
                          key={context.id}
                          context={context}
                          onTogglePropagation={(newProp) =>
                            handleToggleContextPropagation(selectedBranch.id, context.id, newProp)
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Promoted Context from Children */}
                {getChildBranches(selectedBranch.id).some(
                  (child) => child.promotedContext.length > 0 || selectedBranch.promotedContext.length > 0
                ) && (
                  <div className="space-y-3 border-t border-slate-800 pt-4">
                    <h4 className="text-sm font-semibold text-green-400 flex items-center gap-2">
                      <span>↑</span> Promoted from Children
                    </h4>
                    {getChildBranches(selectedBranch.id).map((child) =>
                      child.promotedContext.length > 0 ? (
                        <div key={child.id} className="space-y-2 ml-2">
                          <p className="text-xs text-slate-500">{child.name}</p>
                          {child.promotedContext.map((context) => (
                            <div
                              key={context.id}
                              className="bg-slate-800 rounded p-3 text-xs space-y-2 hover:bg-slate-750 transition"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-slate-400">{context.type}</span>
                                <button
                                  onClick={() => handlePromoteContext(selectedBranch.id, context.id, child.id)}
                                  className="text-green-400 hover:text-green-300 transition text-xs"
                                >
                                  Accept
                                </button>
                              </div>
                              <p className="text-slate-300">{context.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : null
                    )}
                  </div>
                )}

                {selectedBranch.inheritedContext.length === 0 &&
                  selectedBranch.localContext.length === 0 &&
                  getChildBranches(selectedBranch.id).every((child) => child.promotedContext.length === 0) && (
                    <p className="text-slate-500 text-sm">No context items yet</p>
                  )}
              </>
            )}
          </div>

          <div className="p-4 border-t border-slate-800">
            <button
              onClick={() => setRightPanelOpen(false)}
              className="w-full text-slate-400 hover:text-slate-200 py-2 transition text-sm"
            >
              Close Panel
            </button>
          </div>
        </div>
      )}

      {/* Toggle Context Panel Button */}
      {!rightPanelOpen && (
        <button
          onClick={() => setRightPanelOpen(true)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 px-2 rounded-l transition"
          title="Show context panel"
        >
          ←
        </button>
      )}
    </div>
  );
}

// Sub-components
function BranchTree({
  project,
  selectedBranchId,
  onSelectBranch,
  expandedBranches,
  onToggleExpanded,
  onCreateChild,
}) {
  const rootBranch = project.branches.find((b) => b.id === 'root');

  const getChildBranches = (parentId) => project.branches.filter((b) => b.parentId === parentId);

  const BranchNode = ({ branch, level }) => {
    const children = getChildBranches(branch.id);
    const isExpanded = expandedBranches.has(branch.id);
    const statusColor = {
      active: 'text-green-400',
      paused: 'text-yellow-400',
      completed: 'text-blue-400',
      archived: 'text-gray-400',
    };

    return (
      <div key={branch.id}>
        <div
          className={`flex items-center gap-2 px-2 py-2 rounded cursor-pointer transition ${
            selectedBranchId === branch.id
              ? 'bg-amber-500 bg-opacity-20 border border-amber-500'
              : 'hover:bg-slate-800'
          }`}
          onClick={() => onSelectBranch(branch.id)}
        >
          {children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpanded(branch.id);
              }}
              className="w-4 h-4 flex items-center justify-center text-slate-400"
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          {children.length === 0 && <span className="w-4" />}

          <span className={`text-sm font-medium ${statusColor[branch.status]}`}>●</span>
          <span className="text-sm flex-1 truncate">{branch.name}</span>
          {children.length > 0 && <span className="text-xs text-slate-500">{children.length}</span>}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onCreateChild(branch.id);
            }}
            className="text-slate-400 hover:text-slate-200 transition text-xs opacity-0 group-hover:opacity-100"
            title="Add child branch"
          >
            +
          </button>
        </div>

        {isExpanded && children.length > 0 && (
          <div className="ml-4 border-l border-slate-700 space-y-1 mt-1">
            {children.map((child) => (
              <BranchNode key={child.id} branch={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return rootBranch ? <BranchNode branch={rootBranch} level={0} /> : null;
}

function ConversationsTab({ branch, onAddConversation, onAddMessage }) {
  const [expandedConvs, setExpandedConvs] = useState(new Set());
  const [chatInputs, setChatInputs] = useState({});

  return (
    <div className="space-y-4">
      <button
        onClick={onAddConversation}
        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold py-2 px-4 rounded-lg transition"
      >
        + New Conversation
      </button>

      <div className="space-y-3">
        {branch.conversations.length === 0 ? (
          <p className="text-slate-500">No conversations yet</p>
        ) : (
          branch.conversations.map((conv) => (
            <div key={conv.id} className="bg-slate-800 rounded-lg overflow-hidden">
              <button
                onClick={() => {
                  setExpandedConvs((prev) => {
                    const next = new Set(prev);
                    if (next.has(conv.id)) {
                      next.delete(conv.id);
                    } else {
                      next.add(conv.id);
                    }
                    return next;
                  });
                }}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-700 transition"
              >
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-white">{conv.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{conv.messages.length} messages</p>
                </div>
                <span className="text-slate-400">{expandedConvs.has(conv.id) ? '▼' : '▶'}</span>
              </button>

              {expandedConvs.has(conv.id) && (
                <div className="border-t border-slate-700 p-4 space-y-4 bg-slate-750">
                  <div className="space-y-3 max-h-72 overflow-y-auto">
                    {conv.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div
                          className={`text-xs font-bold h-6 w-6 rounded flex items-center justify-center flex-shrink-0 ${
                            msg.role === 'user'
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {msg.role === 'user' ? 'U' : 'C'}
                        </div>
                        <div
                          className={`flex-1 p-2 rounded text-sm ${
                            msg.role === 'user'
                              ? 'bg-amber-500 bg-opacity-20 text-slate-50'
                              : 'bg-slate-700 text-slate-200'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 border-t border-slate-700 pt-3">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={chatInputs[conv.id] || ''}
                      onChange={(e) =>
                        setChatInputs({ ...chatInputs, [conv.id]: e.target.value })
                      }
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && chatInputs[conv.id]?.trim()) {
                          onAddMessage(conv.id, chatInputs[conv.id]);
                          setChatInputs({ ...chatInputs, [conv.id]: '' });
                        }
                      }}
                      className="flex-1 bg-slate-700 border border-slate-600 text-slate-50 px-3 py-2 rounded text-sm"
                    />
                    <button
                      onClick={() => {
                        if (chatInputs[conv.id]?.trim()) {
                          onAddMessage(conv.id, chatInputs[conv.id]);
                          setChatInputs({ ...chatInputs, [conv.id]: '' });
                        }
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold py-2 px-3 rounded text-sm transition"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ArtifactsTab({ branch, onAddArtifact }) {
  const [showForm, setShowForm] = useState(false);
  const [newArtifact, setNewArtifact] = useState({ name: '', type: 'document' });

  const handleAddArtifact = () => {
    if (newArtifact.name.trim()) {
      onAddArtifact(newArtifact.name, newArtifact.type);
      setNewArtifact({ name: '', type: 'document' });
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-4">
      {showForm ? (
        <div className="bg-slate-800 p-4 rounded-lg space-y-3">
          <input
            autoFocus
            type="text"
            placeholder="Artifact name"
            value={newArtifact.name}
            onChange={(e) => setNewArtifact({ ...newArtifact, name: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 text-slate-50 px-3 py-2 rounded"
          />
          <select
            value={newArtifact.type}
            onChange={(e) => setNewArtifact({ ...newArtifact, type: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 text-slate-50 px-3 py-2 rounded"
          >
            <option value="document">Document</option>
            <option value="code">Code</option>
            <option value="data">Data</option>
            <option value="image">Image</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleAddArtifact}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold py-2 rounded transition"
            >
              Create
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-50 font-semibold py-2 rounded transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold py-2 px-4 rounded-lg transition w-full"
        >
          + New Artifact
        </button>
      )}

      <div className="grid grid-cols-1 gap-3">
        {branch.artifacts.length === 0 ? (
          <p className="text-slate-500">No artifacts yet</p>
        ) : (
          branch.artifacts.map((artifact) => (
            <div key={artifact.id} className="bg-slate-800 p-4 rounded-lg hover:bg-slate-750 transition">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-white">{artifact.name}</h4>
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                  {artifact.type}
                </span>
              </div>
              <p className="text-sm text-slate-400 line-clamp-2">{artifact.content}</p>
              <p className="text-xs text-slate-500 mt-2">
                {new Date(artifact.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TasksTab({ branch, allBranches, onAddTask, onMoveTask }) {
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', assignedBranch: '' });

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      onAddTask(newTask.title, newTask.assignedBranch || undefined);
      setNewTask({ title: '', assignedBranch: '' });
      setShowForm(false);
    }
  };

  const statuses = ['todo', 'in-progress', 'done'];

  return (
    <div className="space-y-4">
      {showForm ? (
        <div className="bg-slate-800 p-4 rounded-lg space-y-3">
          <input
            autoFocus
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 text-slate-50 px-3 py-2 rounded"
          />
          <select
            value={newTask.assignedBranch}
            onChange={(e) => setNewTask({ ...newTask, assignedBranch: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 text-slate-50 px-3 py-2 rounded"
          >
            <option value="">No assignment</option>
            {allBranches
              .filter((b) => b.id !== branch.id)
              .map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleAddTask}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold py-2 rounded transition"
            >
              Create
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-50 font-semibold py-2 rounded transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold py-2 px-4 rounded-lg transition w-full"
        >
          + New Task
        </button>
      )}

      <div className="grid grid-cols-3 gap-4">
        {statuses.map((status) => (
          <div key={status} className="bg-slate-800 rounded-lg p-3 flex flex-col">
            <h4 className="font-semibold text-white mb-3 text-sm capitalize">
              {status.replace('-', ' ')}
            </h4>
            <div className="space-y-2 flex-1">
              {branch.tasks
                .filter((t) => t.status === status)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = 'move';
                      e.dataTransfer.setData('taskId', task.id);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const taskId = e.dataTransfer.getData('taskId');
                      onMoveTask(taskId, status);
                    }}
                    className="bg-slate-700 p-3 rounded cursor-move hover:bg-slate-600 transition"
                  >
                    <p className="text-sm text-white font-medium">{task.title}</p>
                    {task.assignedBranch && (
                      <p className="text-xs text-slate-400 mt-1">
                        →{' '}
                        {allBranches.find((b) => b.id === task.assignedBranch)?.name || 'Unknown'}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContextItem({ context, onTogglePropagation }) {
  const propagationOptions = ['local', 'upstream', 'downstream', 'both'];

  return (
    <div className="bg-slate-800 rounded p-3 space-y-2 hover:bg-slate-750 transition">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded">
          {context.type}
        </span>
        <select
          value={context.propagation}
          onChange={(e) => onTogglePropagation(e.target.value)}
          className="text-xs bg-slate-700 border border-slate-600 text-slate-300 px-2 py-0.5 rounded"
        >
          {propagationOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <p className="text-sm text-slate-200">{context.content}</p>
      <p className="text-xs text-slate-500">from {context.source}</p>
    </div>
  );
}
