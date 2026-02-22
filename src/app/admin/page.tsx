'use client';

import React, { useState, useEffect } from 'react';
import {
    Lock,
    FileText,
    Database,
    PlusCircle,
    Save,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    ChevronDown,
    Folder,
    LayoutDashboard,
    Settings,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

type Election = {
    id: string;
    name: string;
    type: 'presidential' | 'legislative';
    country: string;
    flag: string;
    targetDate: string;
    isDefault: boolean;
};

type FileNode = {
    name: string;
    isFile: boolean;
    originalPath?: string;
    children: Record<string, FileNode>;
};

const buildFileTree = (paths: string[]): FileNode => {
    const root: FileNode = { name: 'root', isFile: false, children: {} };
    paths.forEach(path => {
        const parts = path.split(/[/\\]/);
        let current = root;
        parts.forEach((part, i) => {
            const isFile = i === parts.length - 1;
            if (!current.children[part]) {
                current.children[part] = {
                    name: part,
                    isFile,
                    children: {},
                    originalPath: isFile ? path : undefined
                };
            }
            current = current.children[part];
        });
    });
    return root;
};

const FileTreeFolder = ({
    node,
    level = 0,
    onSelectFile,
    selectedFile
}: {
    node: FileNode;
    level?: number;
    onSelectFile: (path: string) => void;
    selectedFile: string | null;
}) => {
    const [isOpen, setIsOpen] = useState(level === 0);
    const nodes = Object.values(node.children).sort((a, b) => {
        if (a.isFile === b.isFile) return a.name.localeCompare(b.name);
        return a.isFile ? 1 : -1;
    });

    if (level > 0 && !node.isFile) {
        return (
            <div className="w-full">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center gap-2 py-2 pr-4 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-all"
                    style={{ paddingLeft: `${0.5 + level * 0.75}rem` }}
                >
                    {isOpen ? <ChevronDown className="w-4 h-4 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 flex-shrink-0" />}
                    <Folder className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{node.name}</span>
                </button>
                {isOpen && (
                    <div className="w-full">
                        {nodes.map(child => (
                            <FileTreeFolder
                                key={child.name}
                                node={child}
                                level={level + 1}
                                onSelectFile={onSelectFile}
                                selectedFile={selectedFile}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (node.isFile) {
        const isSelected = selectedFile === node.originalPath;
        return (
            <button
                onClick={() => node.originalPath && onSelectFile(node.originalPath)}
                className={`w-full flex items-center justify-between py-2 pr-4 text-sm rounded-lg transition-all ${isSelected ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    }`}
                style={{ paddingLeft: `${0.5 + Math.max(1, level) * 0.75}rem` }}
            >
                <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 flex-shrink-0 opacity-50" />
                    <span className="truncate">{node.name}</span>
                </div>
            </button>
        );
    }

    return (
        <div className="space-y-1 w-full mt-2">
            {nodes.map(child => (
                <FileTreeFolder
                    key={child.name}
                    node={child}
                    level={level + 1}
                    onSelectFile={onSelectFile}
                    selectedFile={selectedFile}
                />
            ))}
        </div>
    );
};

export default function AdminPage() {
    const [token, setToken] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<'elections' | 'prompts' | 'data'>('elections');
    const [files, setFiles] = useState<string[]>([]);
    const [elections, setElections] = useState<Election[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [fileContent, setFileContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // New Election Form
    const [newElection, setNewElection] = useState<Partial<Election>>({
        type: 'presidential',
        country: 'FR',
        flag: '🇫🇷'
    });

    useEffect(() => {
        const savedToken = localStorage.getItem('admin_token');
        if (savedToken) {
            setToken(savedToken);
            verifySavedToken(savedToken);
        }
    }, []);

    const verifySavedToken = async (t: string) => {
        try {
            const res = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: t })
            });
            if (res.ok) {
                setIsAuthenticated(true);
                loadFiles(t);
                loadElections();
            } else {
                localStorage.removeItem('admin_token');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });

            if (res.ok) {
                setIsAuthenticated(true);
                localStorage.setItem('admin_token', token);
                loadFiles(token);
                loadElections();
                setMessage({ type: 'success', text: 'Authentifié avec succès' });
            } else {
                setMessage({ type: 'error', text: 'Token invalide' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Erreur de connexion' });
        } finally {
            setLoading(false);
        }
    };

    const loadFiles = async (t: string) => {
        try {
            const res = await fetch('/api/admin/files', {
                headers: { 'x-admin-token': t }
            });
            const data = await res.json();
            if (data.files) {
                setFiles(data.files);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const loadElections = async () => {
        try {
            const res = await fetch('/api/elections');
            if (res.ok) {
                const data = await res.json();
                setElections(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const loadFileContent = async (path: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/files?path=${encodeURIComponent(path)}`, {
                headers: { 'x-admin-token': token }
            });
            const data = await res.json();
            setFileContent(data.content || '');
            setSelectedFile(path);
        } catch (e) {
            setMessage({ type: 'error', text: 'Erreur lors du chargement du fichier' });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveFile = async () => {
        if (!selectedFile) return;
        setLoading(true);
        try {
            const res = await fetch('/api/admin/files', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify({ path: selectedFile, content: fileContent })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Fichier enregistré avec succès' });
            } else {
                setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement' });
            }
        } catch (e) {
            setMessage({ type: 'error', text: 'Erreur réseau' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddElection = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/elections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token
                },
                body: JSON.stringify(newElection)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Élection créée avec succès !' });
                loadFiles(token);
                loadElections();
                setNewElection({ type: 'presidential', country: 'FR', flag: '🇫🇷' });
            } else {
                const error = await res.json();
                setMessage({ type: 'error', text: error.error || 'Erreur lors de la création' });
            }
        } catch (e) {
            setMessage({ type: 'error', text: 'Erreur réseau' });
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                            <Lock className="w-8 h-8 text-blue-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">PoliTrack Admin</h1>
                        <p className="text-slate-400">Entrez votre token pour accéder au dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Token d'administration"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
                                required
                            />
                        </div>
                        {message && (
                            <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                                <p className="text-sm">{message.text}</p>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                        >
                            {loading ? "Vérification..." : "Se connecter"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const promptFiles = files.filter(f => f.endsWith('.txt'));
    const dataFiles = files.filter(f => f.endsWith('.json') && f !== 'elections.json');

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Header */}
            <header className="h-16 border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <LayoutDashboard className="w-6 h-6 text-blue-500" />
                        <h1 className="text-lg font-bold text-white">Administration</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-slate-500 bg-slate-800/50 px-2 py-1 rounded">TOKEN: ACTIVE</span>
                    <button
                        onClick={() => {
                            localStorage.removeItem('admin_token');
                            setIsAuthenticated(false);
                        }}
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        Déconnexion
                    </button>
                </div>
            </header>

            <div className="flex h-[calc(100vh-64px)] overflow-hidden">
                {/* Sidebar */}
                <aside className="w-72 bg-slate-900/30 border-r border-white/5 flex flex-col">
                    <nav className="p-4 space-y-1">
                        <button
                            onClick={() => setActiveTab('elections')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'elections' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'hover:bg-white/5 text-slate-400'}`}
                        >
                            <Settings className="w-5 h-5" />
                            <span className="font-medium">Élections</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('prompts')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'prompts' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'hover:bg-white/5 text-slate-400'}`}
                        >
                            <FileText className="w-5 h-5" />
                            <span className="font-medium">Prompts</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('data')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'data' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'hover:bg-white/5 text-slate-400'}`}
                        >
                            <Database className="w-5 h-5" />
                            <span className="font-medium">Données JSON</span>
                        </button>
                    </nav>

                    <div className="mt-8 flex-1 overflow-y-auto px-4 pb-4">
                        {activeTab !== 'elections' && (
                            <div className="space-y-4">
                                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4">
                                    Fichiers {activeTab === 'prompts' ? '.txt' : '.json'}
                                </h3>
                                <div className="-mx-2">
                                    <FileTreeFolder
                                        node={buildFileTree(activeTab === 'prompts' ? promptFiles : dataFiles)}
                                        onSelectFile={loadFileContent}
                                        selectedFile={selectedFile}
                                        level={0}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center justify-between gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                            <div className="flex items-center gap-3">
                                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                <p className="text-sm font-medium">{message.text}</p>
                            </div>
                            <button onClick={() => setMessage(null)} className="text-xs opacity-50 hover:opacity-100 uppercase tracking-widest px-2 py-1">Fermer</button>
                        </div>
                    )}

                    {activeTab === 'elections' && (
                        <div className="max-w-4xl space-y-8">
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                        <PlusCircle className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Nouvelle Élection</h2>
                                        <p className="text-slate-500 text-sm">Ajouter une nouvelle campagne à suivre</p>
                                    </div>
                                </div>

                                <form onSubmit={handleAddElection} className="grid grid-cols-2 gap-6 bg-slate-900/50 border border-white/5 p-6 rounded-2xl">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1.5">ID Technique (ex: fr-pres-2030)</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="id-unique"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                value={newElection.id || ''}
                                                onChange={e => setNewElection({ ...newElection, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Nom d'affichage</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Présidentielle 2027"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                value={newElection.name || ''}
                                                onChange={e => setNewElection({ ...newElection, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Pays (Code ISO)</label>
                                                <input
                                                    type="text"
                                                    maxLength={2}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none uppercase"
                                                    value={newElection.country || ''}
                                                    onChange={e => setNewElection({ ...newElection, country: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Drapeau (Emoji)</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none text-center"
                                                    value={newElection.flag || ''}
                                                    onChange={e => setNewElection({ ...newElection, flag: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Style de graphique</label>
                                                <select
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                    value={newElection.type || 'presidential'}
                                                    onChange={e => setNewElection({ ...newElection, type: e.target.value as any })}
                                                >
                                                    <option value="presidential">Présidentiel (Candidats)</option>
                                                    <option value="legislative">Législatif (Partis/Sièges)</option>
                                                    <option value="municipal">Municipal (Villes/Communes)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Date cible</label>
                                                <input
                                                    type="date"
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                                                    value={newElection.targetDate || ''}
                                                    onChange={e => setNewElection({ ...newElection, targetDate: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                                        >
                                            {loading ? "Création..." : "Ajouter l'élection"}
                                        </button>
                                    </div>
                                </form>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-slate-500" />
                                    Configuration Actuelle
                                </h3>
                                <div className="space-y-4">
                                    {elections.length === 0 ? (
                                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 text-center">
                                            <p className="text-slate-500">Aucune élection trouvée.</p>
                                        </div>
                                    ) : (
                                        elections.map((election) => (
                                            <div key={election.id} className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 flex items-center justify-between group hover:bg-slate-900 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center text-2xl border border-white/5">
                                                        {election.flag}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-bold text-white">{election.name}</h4>
                                                            {election.isDefault && (
                                                                <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-black uppercase">Défaut</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                                            <span className="font-mono">{election.id}</span>
                                                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                            <span className="capitalize">{election.type === 'presidential' ? 'Présidentiel' : 'Législatif'}</span>
                                                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                            <span>{election.targetDate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            setActiveTab('data');
                                                            loadFileContent(`${election.id}/${election.type === 'presidential' ? 'candidates_cache.json' : 'partis_cache.json'}`);
                                                        }}
                                                        className="bg-white/5 hover:bg-white/10 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors border border-white/5"
                                                    >
                                                        Éditer Données
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}

                                    <p className="text-slate-500 text-xs italic px-2">
                                        Note : Pour modifier les paramètres avancés ou supprimer une élection, utilisez l'onglet <code className="text-blue-400">Données JSON</code> sur le fichier <code className="text-blue-400">elections.json</code>.
                                    </p>
                                </div>
                            </section>
                        </div>
                    )}

                    {(activeTab === 'prompts' || activeTab === 'data') && (
                        <div className="h-full flex flex-col">
                            {!selectedFile ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-white/5 rounded-3xl">
                                    <FileText className="w-16 h-16 mb-4 opacity-10" />
                                    <p className="text-lg">Sélectionnez un fichier à modifier dans la barre latérale</p>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                                {activeTab === 'prompts' ? <FileText className="w-5 h-5" /> : <Database className="w-5 h-5" />}
                                                {selectedFile}
                                            </h2>
                                            <p className="text-slate-500 text-sm">Édition en direct du contenu</p>
                                        </div>
                                        <button
                                            onClick={handleSaveFile}
                                            disabled={loading}
                                            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-semibold px-6 py-2.5 rounded-xl transition-all shadow-lg flex items-center gap-2"
                                        >
                                            <Save className="w-5 h-5" />
                                            {loading ? "Sauvegarde..." : "Enregistrer"}
                                        </button>
                                    </div>
                                    <div className="flex-1 min-h-[500px] relative group">
                                        <textarea
                                            value={fileContent}
                                            onChange={(e) => setFileContent(e.target.value)}
                                            className="w-full h-full bg-slate-950 border border-white/10 rounded-2xl p-6 text-slate-300 font-mono text-sm leading-relaxed focus:ring-2 focus:ring-blue-500/30 outline-none resize-none shadow-inner"
                                            spellCheck={false}
                                        />
                                        <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-700 uppercase tracking-widest pointer-events-none group-hover:opacity-100 transition-opacity">
                                            Editor Mode
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
