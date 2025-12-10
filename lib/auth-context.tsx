
"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { AuthContextType, UserProfile, UserRole } from './types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        // Buscar dados do usuário no Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile
          setUser(userData)
        } else {
          // Criar perfil básico se não existir
          const newUser: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            role: 'cliente',
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
          }
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
          setUser(newUser)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
      
      const newUser: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName: userData.displayName || '',
        role: userData.role || 'cliente',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        ...userData,
      }

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser)
    } catch (error) {
      console.error('Erro ao criar conta:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      throw error
    }
  }

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return

    try {
      const updatedUser = { ...user, ...data, updatedAt: new Date() }
      await updateDoc(doc(db, 'users', user.uid), updatedUser)
      setUser(updatedUser)
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
