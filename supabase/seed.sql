-- ============================================================
-- SEED DATA FOR ENGINEERING OS V2
-- Run this in your Supabase SQL Editor AFTER schema.sql
-- ============================================================

-- Clean up existing data to avoid conflicts
DELETE FROM public.topic_dependencies;
DELETE FROM public.topics;
DELETE FROM public.tracks;

-- 1. Insert Tracks
INSERT INTO public.tracks (id, title, description, icon, color, order_index) VALUES
('11111111-1111-1111-1111-111111111111', 'Data Structures & Algorithms', 'Master problem solving for top tech companies.', 'Network', '#3b82f6', 1),
('22222222-2222-2222-2222-222222222222', 'C++ Programming', 'Master modern C++ from basics to advanced STL.', 'Code2', '#06b6d4', 2),
('33333333-3333-3333-3333-333333333333', 'Full Stack Development', 'Build production-ready web applications.', 'Layers', '#f97316', 3),
('44444444-4444-4444-4444-444444444444', 'AI & Machine Learning', 'Understand the math and models behind AI.', 'BrainCircuit', '#8b5cf6', 4);

-- 2. Insert DSA Topics
INSERT INTO public.topics (id, track_id, title, slug, description, definition, why_it_exists, real_world_usage, complexity_notes, estimated_hours, difficulty, importance, company_frequency, learning_objectives, order_index) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Arrays & Hashing', 'dsa-arrays-hashing', 'Fundamental data structures for storing and looking up elements.', 'An array is a contiguous block of memory. Hashing maps keys to values for O(1) lookups.', 'Sequential access and fast lookups are the most common operations in programming.', 'Database indexing, caching, frequency counting.', 'Array Access: O(1), Hash Map Search: O(1) avg, O(N) worst.', 10, 'Easy', 'Critical', '{"Google", "Amazon", "Meta"}', '{"Understand memory allocation", "Implement HashMap", "Two Pointer basics"}', 1),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Two Pointers', 'dsa-two-pointers', 'Optimize array searches by using two references.', 'A technique where two pointers iterate through a data structure simultaneously to save time/space.', 'Reduces nested loops from O(N^2) to O(N).', 'String matching, palindrome checking, finding pairs.', 'Time: O(N), Space: O(1)', 8, 'Medium', 'High', '{"Microsoft", "Apple", "Uber"}', '{"Solve Two Sum II", "3Sum", "Container With Most Water"}', 2),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'Sliding Window', 'dsa-sliding-window', 'Efficiently process contiguous subarrays or substrings.', 'A technique to reduce the use of nested loops by maintaining a window that slides over the data.', 'Optimizes subset/subarray problems from O(N^2) or O(N^3) to O(N).', 'Network congestion control, rate limiting algorithms, string manipulation.', 'Time: O(N), Space: O(1) or O(K)', 12, 'Medium', 'Critical', '{"Amazon", "Google", "Atlassian"}', '{"Identify window state", "Handle variable size windows", "Longest Substring Without Repeating"}', 3);

-- 3. Insert C++ Topics
INSERT INTO public.topics (id, track_id, title, slug, description, definition, why_it_exists, real_world_usage, complexity_notes, estimated_hours, difficulty, importance, company_frequency, learning_objectives, order_index) VALUES
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'Pointers & Memory', 'cpp-pointers', 'Direct memory manipulation in C++.', 'A pointer is a variable that stores the memory address of another variable.', 'Allows dynamic memory allocation and efficient array/object passing.', 'Operating systems, game engines, embedded systems.', 'Access: O(1), Allocation depends on OS.', 15, 'Hard', 'Critical', '{"Nvidia", "Qualcomm", "Bloomberg"}', '{"Understand Stack vs Heap", "Pointer Arithmetic", "Memory Leaks"}', 1),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '22222222-2222-2222-2222-222222222222', 'STL Vectors', 'cpp-stl-vector', 'Dynamic arrays in the Standard Template Library.', 'std::vector is a sequence container that encapsulates dynamic size arrays.', 'Arrays need fixed sizes; vectors grow automatically.', 'Virtually every modern C++ application.', 'Push back: O(1) amortized. Insert/Erase: O(N).', 5, 'Easy', 'Critical', '{"All Companies"}', '{"Capacity vs Size", "Iterators", "Reallocation mechanism"}', 2),
('ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', 'Smart Pointers', 'cpp-smart-pointers', 'Automatic memory management (RAII).', 'Template classes that act like pointers but automatically manage memory (unique_ptr, shared_ptr, weak_ptr).', 'To prevent memory leaks and dangling pointers in complex systems.', 'Modern C++ game engines (Unreal), browsers.', 'Negligible overhead for unique_ptr. Small atomic counter overhead for shared_ptr.', 10, 'Hard', 'High', '{"Google", "Microsoft", "HFTs"}', '{"std::unique_ptr", "std::shared_ptr", "std::weak_ptr", "Cyclic references"}', 3);

-- 4. Dependencies
INSERT INTO public.topic_dependencies (prerequisite_id, dependent_id) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), -- Arrays -> Two Pointers
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc'), -- Two Pointers -> Sliding Window
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'ffffffff-ffff-ffff-ffff-ffffffffffff'); -- Pointers -> Smart Pointers

