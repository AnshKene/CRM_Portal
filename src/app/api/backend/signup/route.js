// src/app/api/backend/signup/route.js

import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../../lib/prisma'; // Assuming Prisma is used for database

export default async function handler(req = NextApiRequest, res = NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        fullName,
        email,
        password: hashedPassword,
      },
    });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

