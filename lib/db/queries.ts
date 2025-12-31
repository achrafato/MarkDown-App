import sqlite3 from 'sqlite3';
import path from 'path';
import { initializeDb } from './init';

let db: sqlite3.Database | null = null;
let isInitialized = false;

export async function getDatabase(): Promise<sqlite3.Database> {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'blog.db');
    db = new sqlite3.Database(dbPath);
  }

  // Ensure tables are created before returning the connection
  if (!isInitialized) {
    await initializeDb(); // Make sure initializeDb returns a Promise!
    isInitialized = true;
  }

  return db;
}

export interface User {
  id: number;
  email: string;
  name: string;
  bio: string | null;
  avatar: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  excerpt: string;
  published: boolean;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

// Helper function to promisify database operations
function dbRun(db: sqlite3.Database, sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function dbGet(db: sqlite3.Database, sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbAll(db: sqlite3.Database, sql: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

// User queries
export async function getUserById(id: number): Promise<User | undefined> {
  const db = await getDatabase();
  const sql = 'SELECT id, email, name, bio, avatar, created_at, updated_at FROM users WHERE id = ?';
  return dbGet(db, sql, [id]);
}

export async function getUserByEmail(email: string): Promise<(User & { password: string }) | undefined> {
  const db = await getDatabase();
  const sql = 'SELECT id, email, password, name, bio, avatar, created_at, updated_at FROM users WHERE email = ?';
  return dbGet(db, sql, [email]);
}

export async function createUser(email: string, password: string, name: string): Promise<User> {
  const db = await getDatabase();
  const sql = 'INSERT INTO users (email, password, name) VALUES (?, ?, ?)';
  const result = await dbRun(db, sql, [email, password, name]);
  const newUser = await getUserById(result.id);

  if (!newUser) {
    throw new Error("User was created but could not be retrieved.");
  }

  return newUser;
}

export async function updateUser(id: number, data: { name?: string; bio?: string; avatar?: string }): Promise<User> {
  const db = await getDatabase();
  const updates = [];
  const values = [];

  if (data.name !== undefined) {
    updates.push('name = ?');
    values.push(data.name);
  }
  if (data.bio !== undefined) {
    updates.push('bio = ?');
    values.push(data.bio);
  }
  if (data.avatar !== undefined) {
    updates.push('avatar = ?');
    values.push(data.avatar);
  }
  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
  await dbRun(db, sql, [...values]);
  const newUser = await getUserById(id);

  if (!newUser) {
    throw new Error("User was updated but could not be retrieved.");
  }

  return newUser;
}

// Post queries
export async function getPostById(id: number): Promise<(Post & { author: User }) | undefined> {
  const db = await getDatabase();
  const sql = `
    SELECT p.id, p.user_id, p.title, p.content, p.excerpt, p.published, p.category,
           p.created_at, p.updated_at,
           u.id as author_id, u.email, u.name, u.bio, u.avatar
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `;
  const row = await dbGet(db, sql, [id]);
  
  if (!row) return undefined;
  
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    published: row.published,
    category: row.category,
    created_at: row.created_at,
    updated_at: row.updated_at,
    author: {
      id: row.author_id,
      email: row.email,
      name: row.name,
      avatar: row.avatar,
      bio: row.bio,
      created_at: '',
      updated_at: ''
    }
  };
}

export async function getAllPublishedPosts(limit: number = 10, offset: number = 0): Promise<(Post & { author: User })[]> {
  const db = await getDatabase();
  const sql = `
    SELECT p.id, p.user_id, p.title, p.content, p.excerpt, p.published, 
           p.created_at, p.updated_at,
           u.id as author_id, u.email, u.name, u.bio, u.avatar
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.published = 1
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `;
  const rows = await dbAll(db, sql, [limit, offset]);
  return rows.map(row => ({
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    content: row.content,
    category: row.category,
    excerpt: row.excerpt,
    published: row.published,
    created_at: row.created_at,
    updated_at: row.updated_at,
    author: {
      id: row.author_id,
      email: row.email,
      name: row.name,
      bio: row.bio,
      avatar: row.avatar,
      created_at: '',
      updated_at: ''
    }
  }));
}


export async function getUsersWithPostCount(): Promise<(User & { postCount: number })[]> {
  const db = await getDatabase();
  
  const sql = `
    SELECT u.id, u.email, u.name, u.bio, u.avatar, u.created_at, u.updated_at,
           COUNT(p.id) as post_count
    FROM users u
    LEFT JOIN posts p ON u.id = p.user_id AND p.published = 1
    GROUP BY u.id
    ORDER BY post_count DESC
  `;

  const rows = await dbAll(db, sql);

  return rows.map(row => ({
    id: row.id,
    email: row.email,
    name: row.name,
    bio: row.bio,
    avatar: row.avatar,
    created_at: row.created_at,
    updated_at: row.updated_at,
    postCount: row.post_count
  }));
}


export async function searchPosts(query: string): Promise<(Post & { author: User })[]> {
  const db = await getDatabase();
  
  // 1. Prepare the search term with wildcards
  // %term% means "find this text anywhere in the string"
  const searchTerm = `%${query}%`;

  // 2. The SQL Query
  // specific logic: We check published=1 AND (title match OR content match OR excerpt match)
  const sql = `
    SELECT p.id, p.user_id, p.title, p.content, p.excerpt, p.published, p.category,
      p.created_at, p.updated_at,
      u.id as author_id, u.email, u.name, u.bio, u.avatar
    FROM posts p
    INNER JOIN users u ON p.user_id = u.id
    WHERE p.published = 1
    AND (
      title LIKE ? OR 
      content LIKE ? OR 
      excerpt LIKE ? OR
      category LIKE ?
    )
    ORDER BY p.created_at DESC
  `;

  // 3. Run the query
  // We pass 'searchTerm' 4 times because we have 4 placeholders (?)
  const rows = await dbAll(db, sql, [searchTerm, searchTerm, searchTerm, searchTerm]);

  // 4. Map the results to your BlogPost type
  return rows.map(row => ({
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    category: row.category,
    published: row.published,
    created_at: row.created_at,
    updated_at: row.updated_at,
    author: {
      id: row.author_id,
      email: row.email,
      name: row.name,
      bio: row.bio,
      avatar: row.avatar,
      created_at: '',
      updated_at: ''
    }
  }));
}


export async function getUserPosts(userId: number): Promise<Post[]> {
  const db = await getDatabase();
  const sql = 'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC';
  return dbAll(db, sql, [userId]);
}

export async function createPost(userId: number, title: string, content: string, excerpt: string | null = null, category: string | null = null, published: boolean | false): Promise<Post> {
  const db = await getDatabase();
  const sql = 'INSERT INTO posts (user_id, title, content, excerpt, category, published) VALUES (?, ?, ?, ?, ?, ?)';
  const result = await dbRun(db, sql, [userId, title, content, excerpt, category, published]);
  if (!result) {
    throw new Error("Issue creating post");
  }

  const post = await getPostById(result.id);
  return post!;
}

export async function updatePost(id: number, data: { title?: string; content?: string; excerpt?: string | null; published?: boolean; category?: string | null }): Promise<Post> {
  const db = await getDatabase();
  const updates = [];
  const values = [];

  if (data.title !== undefined) {
    updates.push('title = ?');
    values.push(data.title);
  }
  if (data.content !== undefined) {
    updates.push('content = ?');
    values.push(data.content);
  }
  if (data.excerpt !== undefined) {
    updates.push('excerpt = ?');
    values.push(data.excerpt);
  }
  if (data.published !== undefined) {
    updates.push('published = ?');
    values.push(data.published ? 1 : 0);
  }
  if (data.category !== undefined) {
    updates.push('category = ?');
    values.push(data.category);
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const sql = `UPDATE posts SET ${updates.join(', ')} WHERE id = ?`;
  await dbRun(db, sql, [...values]);
  const post = await getPostById(id);

  return post!;
}

export async function deletePost(id: number): Promise<boolean> {
  const db = await getDatabase();
  const sql = 'DELETE FROM posts WHERE id = ?';
  const result = await dbRun(db, sql, [id]);
  return result.changes > 0;
}

// Comment queries
export async function getPostComments(postId: number): Promise<(Comment & { author: User })[]> {
  const db = await getDatabase();
  const sql = `
    SELECT c.id, c.post_id, c.user_id, c.content, c.created_at, c.updated_at,
           u.id as author_id, u.email, u.name, u.bio, u.avatar
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at ASC
  `;
  const rows = await dbAll(db, sql, [postId]);
  return rows.map(row => ({
    id: row.id,
    post_id: row.post_id,
    user_id: row.user_id,
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at,
    author: {
      id: row.author_id,
      email: row.email,
      name: row.name,
      avatar: row.avatar,
      bio: row.bio,
      created_at: '',
      updated_at: ''
    }
  }));
}

export async function createComment(postId: number, userId: number, content: string): Promise<Comment> {
  const db = await getDatabase();
  const sql = 'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)';
  const result = await dbRun(db, sql, [postId, userId, content]);
  
  const newComment  = await getCommentById(result.id)!;

  if (!newComment) {
    throw new Error("Comment Inserted but cannot be retrieved");
  }

  return newComment;
}

export async function getCommentById(id: number): Promise<Comment | undefined> {
  const db = await getDatabase();
  const sql = 'SELECT * FROM comments WHERE id = ?';
  return dbGet(db, sql, [id]);
}

export async function deleteComment(id: number): Promise<boolean> {
  const db = await getDatabase();
  const sql = 'DELETE FROM comments WHERE id = ?';
  const result = await dbRun(db, sql, [id]);
  return result.changes > 0;
}
// Category queries
export async function getAllCategories(): Promise<{ category: string; count: number }[]> {
  const db = await getDatabase();
  const sql = `
    SELECT DISTINCT category, COUNT(*) as count 
    FROM posts 
    WHERE published = 1 AND category IS NOT NULL
    GROUP BY category 
    ORDER BY category ASC
  `;
  return dbAll(db, sql);
}

export async function getPostsByCategory(category: string): Promise<any[]> {
  const db = await getDatabase();
  
  // 1. Convert the input to lowercase
  const lowerCategory = category.toLowerCase();

  const sql = `
    SELECT p.id, p.user_id, p.title, p.content, p.excerpt, p.published, 
      p.category, -- <--- 2. ADDED: You must select it to map it later
      p.created_at, p.updated_at,
      u.id as author_id, u.email, u.name, u.bio, u.avatar
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE LOWER(p.category) = ? AND p.published = 1 -- <--- 3. ADDED: LOWER() function
    ORDER BY p.created_at DESC
  `;

  // 4. Pass the lowercase version
  const rows = await dbAll(db, sql, [lowerCategory]);

  return rows.map(row => ({
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    content: row.content,
    category: row.category, // Now this will work because we added it to SELECT
    excerpt: row.excerpt,
    published: row.published,
    created_at: row.created_at,
    updated_at: row.updated_at,
    author: {
      id: row.author_id,
      email: row.email,
      name: row.name,
      bio: row.bio,
      avatar: row.avatar,
      created_at: '',
      updated_at: ''
    }
  }));
}