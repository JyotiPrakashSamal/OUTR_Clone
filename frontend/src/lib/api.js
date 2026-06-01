import { supabase } from '../supabaseClient'

/**
 * OUTR Portal Centralized API Abstraction Layer
 */

// --- PROFILES API ---
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function getAllProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

// --- FILE TRACKING API ---
export async function getFileTrackingList(filters = {}) {
  let query = supabase.from('file_tracking').select('*')

  if (filters.student_regd) {
    query = query.eq('student_regd', filters.student_regd)
  }
  if (filters.school_id) {
    query = query.eq('school_id', filters.school_id)
  }
  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  if (filters.forwarded_to) {
    query = query.eq('forwarded_to', filters.forwarded_to)
  }

  const { data, error } = await query.order('submitted_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createFileTrackingRecord(record) {
  const { data, error } = await supabase
    .from('file_tracking')
    .insert([record])
    .select()
  if (error) throw error
  return data
}

export async function updateFileTrackingRecord(id, updates) {
  const { data, error } = await supabase
    .from('file_tracking')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data
}

// --- HOSTEL STUDENTS API ---
export async function getHostelStudents(assignedHostel) {
  let query = supabase.from('students_hostel').select('*')
  
  if (assignedHostel && assignedHostel !== 'All') {
    query = query.eq('hostel', assignedHostel)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function createHostelStudent(studentData) {
  const { data, error } = await supabase
    .from('students_hostel')
    .insert([studentData])
    .select()
  if (error) throw error
  return data
}

export async function updateHostelStudentStatus(id, newStatus) {
  const { data, error } = await supabase
    .from('students_hostel')
    .update({ status: newStatus })
    .eq('id', id)
    .select()
  if (error) throw error
  return data
}
